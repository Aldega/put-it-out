-- «Как это потушить»: кооперативная миссия «Авария Ф-1» для Roblox.
-- Болид вылетел с трассы и врезался в шинный барьер. Мотор горит, течёт топливо, пилот в кокпите,
-- а по трассе ещё несутся другие болиды. Каждый игрок берёт своё средство и тушит вместе с другими.
-- Все тексты пишутся по-русски, перевод лежит в ReplicatedStorage.I18n (ключ = русская строка).

local Players = game:GetService("Players")
local RS = game:GetService("ReplicatedStorage")
local ServerStorage = game:GetService("ServerStorage")
local RunService = game:GetService("RunService")

local CFG = {
	waitTime = 5,        -- пауза перед раундом
	planTime = 6,        -- «осмотрись и составь план»: огонь стоит на месте
	resultTime = 15,     -- окно итогов
	maxTime = 300,       -- предохранитель: раунд не длится дольше
	sprayRange = 30,     -- дальность струи, studs
	hitRadius = 3.5,     -- насколько точно надо попасть в объект
	drainTime = 4,       -- батарея разряжается после выключателя
	reigniteTime = 3.5,  -- через сколько мотор вспыхивает снова
	smoulderTime = 6,    -- через сколько тлеющие шины вспыхивают снова
	raceSpeed = 150,     -- скорость чужих болидов
}

-- средства тушения: сколько секунд струи в баллоне и как выглядит струя
local AGENTS = {
	water = { name = "Водяной огнетушитель", secs = 14, jet = Color3.fromRGB(90, 175, 255), band = Color3.fromRGB(255, 255, 255) },
	powder = { name = "Порошковый огнетушитель", secs = 9, jet = Color3.fromRGB(255, 244, 214), band = Color3.fromRGB(63, 169, 245) },
	foam = { name = "Пенный огнетушитель AFFF", secs = 11, jet = Color3.fromRGB(255, 255, 255), band = Color3.fromRGB(243, 227, 176) },
}

-- как каждое средство сбивает пламя (доля огня в секунду)
local KNOCK = {
	powder = { engine = 0.5, spill = 0.6, barrier = 0.35 },
	foam = { engine = 0.28, spill = 0.5, barrier = 0.22 },
}

local function new(cls, props, parent)
	local o = Instance.new(cls)
	for k, v in pairs(props or {}) do o[k] = v end
	if parent then o.Parent = parent end
	return o
end

-- связь с игроками
local Remotes = new("Folder", { Name = "FireRemotes" }, RS)
local SayEv = new("RemoteEvent", { Name = "Say" }, Remotes)
local SprayEv = new("RemoteEvent", { Name = "Spray" }, Remotes)
local ResultEv = new("RemoteEvent", { Name = "Result" }, Remotes)
local State = new("Folder", { Name = "MissionState" }, RS)
local function setS(k, v) State:SetAttribute(k, v) end

-- папка для струй и якорь для их концов
local FX = new("Folder", { Name = "SprayFX" }, workspace)
local Anchor = new("Part", { Name = "SprayAnchor", Anchored = true, CanCollide = false, CanQuery = false, CanTouch = false, Transparency = 1, Size = Vector3.new(1, 1, 1), CFrame = CFrame.new(0, -50, 0) }, FX)

-- миссию из Workspace убираем в хранилище и копируем заново в каждом раунде
local template = workspace:WaitForChild("Mission")
template.Parent = ServerStorage

local phase = "wait"
local M = nil -- состояние текущего раунда
local lastSay = {}

local function say(text, kind, args, plr)
	if plr then SayEv:FireClient(plr, text, kind or "", args)
	else SayEv:FireAllClients(text, kind or "", args) end
end

-- ошибка считается один раз за раунд, а сообщение повторяется не чаще раза в 2 секунды
local function mistake(key, text, plr)
	if not M then return end
	if not M.mistakes[key] then M.mistakes[key] = true; M.mistakeCount = M.mistakeCount + 1; setS("Mistakes", M.mistakeCount) end
	local now = os.clock()
	if (lastSay[key] or 0) + 2 < now then lastSay[key] = now; say(text, "bad", nil, plr) end
end

local function once(key, text, kind, args)
	if not M or M.said[key] then return end
	M.said[key] = true
	say(text, kind, args)
end

----------------------------------------------------------------------
-- Подсказки над предметами (ProximityPrompt). Клиент сам переводит текст по атрибутам.
----------------------------------------------------------------------
local function prompt(parent, objectText, actionText, key, hold, fn)
	local p = new("ProximityPrompt", {
		ObjectText = objectText, ActionText = actionText, KeyboardKeyCode = key or Enum.KeyCode.E,
		HoldDuration = hold or 0, MaxActivationDistance = 12, RequiresLineOfSight = false,
		Exclusivity = Enum.ProximityPromptExclusivity.AlwaysShow,
	}, parent)
	p:SetAttribute("ObjectKey", objectText)
	p:SetAttribute("ActionKey", actionText)
	p.Triggered:Connect(function(plr)
		if not M then return end
		if phase == "plan" then say("Сначала осмотрись: миссия вот-вот начнётся!", "", nil, plr) return end
		if phase ~= "play" then return end
		fn(plr, p)
	end)
	return p
end

local function setPromptText(p, actionText)
	p.ActionText = actionText
	p:SetAttribute("ActionKey", actionText)
end

----------------------------------------------------------------------
-- Движение фигурок и машин
----------------------------------------------------------------------
local function smooth(k) return k * k * (3 - 2 * k) end

-- переместить модель на delta за dur секунд
local function slide(model, delta, dur, done)
	task.spawn(function()
		local start = model:GetPivot()
		local t = 0
		while t < dur do
			t = t + RunService.Heartbeat:Wait()
			if not model.Parent then return end
			model:PivotTo(start + delta * smooth(math.min(1, t / dur)))
		end
		if done then done() end
	end)
end

-- пройти к точке (высота центра модели сохраняется), лицом по ходу движения
local function walkTo(model, target, speed, done)
	task.spawn(function()
		local start = model:GetPivot().Position
		local goal = Vector3.new(target.X, start.Y, target.Z)
		local dist = (goal - start).Magnitude
		if dist < 0.1 then if done then done() end return end
		local dur = dist / speed
		local t = 0
		while t < dur do
			t = t + RunService.Heartbeat:Wait()
			if not model.Parent then return end
			local k = math.min(1, t / dur)
			local p = start:Lerp(goal, k)
			local bob = math.abs(math.sin(t * 12)) * 0.3
			model:PivotTo(CFrame.lookAt(p, goal + (goal - start).Unit * 5) + Vector3.new(0, bob, 0))
		end
		model:PivotTo(CFrame.lookAt(goal, goal + (goal - start).Unit * 5))
		if done then done() end
	end)
end

----------------------------------------------------------------------
-- Огнетушители (инструменты)
----------------------------------------------------------------------
local function isExtinguisher(tool) return tool:IsA("Tool") and tool:GetAttribute("Agent") ~= nil end

local function giveTool(plr, agent)
	local char = plr.Character
	local hum = char and char:FindFirstChildOfClass("Humanoid")
	if not hum then return end
	-- в руках только один огнетушитель: так каждый берёт своё, и команда делит работу
	for _, holder in ipairs({ plr:FindFirstChildOfClass("Backpack"), char }) do
		if holder then for _, t in ipairs(holder:GetChildren()) do if isExtinguisher(t) then t:Destroy() end end end
	end
	local a = AGENTS[agent]
	local tool = new("Tool", { Name = a.name, CanBeDropped = false, RequiresHandle = true, GripPos = Vector3.new(0, -0.2, 0) })
	tool:SetAttribute("Agent", agent)
	tool:SetAttribute("NameKey", a.name)
	tool:SetAttribute("Charge", 1)
	local h = new("Part", { Name = "Handle", Size = Vector3.new(0.9, 2.2, 0.9), Color = Color3.fromRGB(230, 59, 46), Material = Enum.Material.SmoothPlastic, CanCollide = false, Massless = true }, tool)
	local band = new("Part", { Name = "Band", Size = Vector3.new(0.95, 0.5, 0.95), Color = a.band, Material = Enum.Material.SmoothPlastic, CanCollide = false, Massless = true, CFrame = h.CFrame + Vector3.new(0, 0.3, 0) }, tool)
	new("WeldConstraint", { Part0 = h, Part1 = band }, h)
	local nozzle = new("Part", { Name = "Nozzle", Size = Vector3.new(0.3, 0.3, 0.9), Color = Color3.fromRGB(29, 27, 38), CanCollide = false, Massless = true, CFrame = h.CFrame + Vector3.new(0, 1.1, -0.4) }, tool)
	new("WeldConstraint", { Part0 = h, Part1 = nozzle }, h)
	tool.Parent = plr:FindFirstChildOfClass("Backpack")
	hum:EquipTool(tool)
end

----------------------------------------------------------------------
-- Струя: луч от игрока до точки прицела + брызги на конце
----------------------------------------------------------------------
local SP = {} -- [player] = { on, pos, beam, a0, a1, splash, stunUntil }

local function dropFX(s)
	if s.beam then s.beam:Destroy() end
	if s.a1 then s.a1:Destroy() end
	if s.a0 then s.a0:Destroy() end
	s.beam, s.a0, s.a1, s.splash = nil, nil, nil, nil
end

local function ensureFX(plr, s, color)
	local char = plr.Character
	local hrp = char and char:FindFirstChild("HumanoidRootPart")
	if not hrp then return false end
	if not (s.a0 and s.a0.Parent == hrp) then
		dropFX(s)
		s.a0 = new("Attachment", { Name = "SprayFrom", Position = Vector3.new(0.9, 0.4, -1.6) }, hrp)
		s.a1 = new("Attachment", { Name = "SprayTo" }, Anchor)
		s.beam = new("Beam", {
			Attachment0 = s.a0, Attachment1 = s.a1, Width0 = 0.35, Width1 = 2.4, FaceCamera = true, Segments = 12,
			CurveSize0 = 0, CurveSize1 = 0, LightEmission = 0.25, Enabled = false,
			Transparency = NumberSequence.new({ NumberSequenceKeypoint.new(0, 0.05), NumberSequenceKeypoint.new(1, 0.45) }),
		}, FX)
		s.splash = new("ParticleEmitter", {
			Rate = 45, Lifetime = NumberRange.new(0.35, 0.8), Speed = NumberRange.new(6, 12), SpreadAngle = Vector2.new(180, 180),
			Size = NumberSequence.new({ NumberSequenceKeypoint.new(0, 1.2), NumberSequenceKeypoint.new(1, 0) }),
			Transparency = NumberSequence.new(0.2), Acceleration = Vector3.new(0, -20, 0), Enabled = false,
		}, s.a1)
	end
	s.beam.Color = ColorSequence.new(color)
	s.splash.Color = ColorSequence.new(color)
	return true
end

local function stopSpray(s)
	s.on = false
	if s.beam then s.beam.Enabled = false end
	if s.splash then s.splash.Enabled = false end
end

local function sprayer(plr)
	local s = SP[plr]
	if not s then s = { on = false, stunUntil = 0 }; SP[plr] = s end
	return s
end

local function equippedTool(plr)
	local char = plr.Character
	if not char then return nil end
	for _, t in ipairs(char:GetChildren()) do if isExtinguisher(t) then return t end end
	return nil
end

SprayEv.OnServerEvent:Connect(function(plr, on, pos)
	if typeof(pos) ~= "Vector3" then return end
	local s = sprayer(plr)
	s.pos = pos
	if on == true and not s.on then
		local tool = equippedTool(plr)
		if not tool or os.clock() < s.stunUntil then return end
		if (tool:GetAttribute("Charge") or 0) <= 0 then
			say("Огнетушитель пуст! Возьми новый у маршалов или на пожарном щите.", "bad", nil, plr)
			return
		end
		if ensureFX(plr, s, AGENTS[tool:GetAttribute("Agent")].jet) then
			s.on = true
			s.beam.Enabled = true
			s.splash.Enabled = true
			s.a1.WorldPosition = pos
		end
	elseif on == false and s.on then
		stopSpray(s)
	end
end)

Players.PlayerRemoving:Connect(function(plr)
	local s = SP[plr]
	if s then dropFX(s) end
	SP[plr] = nil
end)

----------------------------------------------------------------------
-- Раунд: подготовка
----------------------------------------------------------------------
local function boxDist(cf, size, p)
	local l = cf:PointToObjectSpace(p)
	local h = size / 2
	local c = Vector3.new(math.clamp(l.X, -h.X, h.X), math.clamp(l.Y, -h.Y, h.Y), math.clamp(l.Z, -h.Z, h.Z))
	return (l - c).Magnitude
end

local function makeFireObj(id, name, model, fire, grow, prio, smokeColor)
	local o = { id = id, name = name, model = model, fire = fire, grow = grow, heat = 0, cover = 0, foamed = false,
		wet = 0, everBurned = fire > 0, prio = prio, spots = {}, steamUntil = 0, smT = 0 }
	for _, d in ipairs(model:GetDescendants()) do
		if d.Name == "FireSpot" then
			table.insert(o.spots, {
				part = d,
				fire = new("Fire", { Size = 5, Heat = 9, Color = Color3.fromRGB(255, 120, 30), SecondaryColor = Color3.fromRGB(255, 214, 63), Enabled = false }, d),
				smoke = new("Smoke", { Enabled = false, Opacity = 0.3, RiseVelocity = 5, Size = 5, Color = smokeColor }, d),
				light = new("PointLight", { Color = Color3.fromRGB(255, 150, 60), Range = 16, Brightness = 0, Shadows = false }, d),
			})
		end
	end
	return o
end

local pilotExit -- объявлена ниже, нужна подсказке у пилота

local function setupRound()
	local m = template:Clone()
	m.Parent = workspace
	M = {
		model = m, t = 0, damage = 0, mistakes = {}, mistakeCount = 0, said = {},
		red = false, redT = nil, safe = false, drainT = nil, ering = false, refT = 0,
		powderT = nil, combo = false, firstSprayT = nil, spillGrow = 1, hintT = 0,
		pilot = { state = "inside", heat = 0, wheel = false, model = m.Pilot },
	}
	local car = m.Car
	M.car = car
	M.lamp = car.Lamp
	M.lampLight = new("PointLight", { Color = Color3.fromRGB(255, 40, 30), Range = 8, Brightness = 3 }, M.lamp)
	M.puddle = m.Spill.Puddle
	M.puddleSize = M.puddle.Size
	M.flag = m.MarshalPost.Flag
	M.flagCF = M.flag.CFrame

	-- что горит
	M.engine = makeFireObj("engine", "Болид", car, 0.6, 0.03, 1, Color3.fromRGB(90, 90, 95))
	M.spill = makeFireObj("spill", "Топливо", m.Spill, 0.3, 0.04, 2, Color3.fromRGB(60, 55, 50))
	M.barrier = makeFireObj("barrier", "Шинный барьер", m.Barrier, 0, 0.025, 3, Color3.fromRGB(25, 25, 28))
	M.objs = { M.engine, M.spill, M.barrier }
	M.links = { { M.engine, M.spill, 0.16 }, { M.spill, M.barrier, 0.04 }, { M.engine, M.barrier, 0.02 } }
	local cf, size = car:GetBoundingBox()
	M.engine.cf, M.engine.size = cf, size
	cf, size = m.Barrier:GetBoundingBox()
	M.barrier.cf, M.barrier.size = cf, size + Vector3.new(0, 2, 0)

	-- искры для удара током
	M.sparks = new("ParticleEmitter", {
		Rate = 0, Enabled = true, Lifetime = NumberRange.new(0.2, 0.5), Speed = NumberRange.new(12, 24), SpreadAngle = Vector2.new(180, 180),
		Color = ColorSequence.new(Color3.fromRGB(255, 240, 120)), LightEmission = 1,
		Size = NumberSequence.new({ NumberSequenceKeypoint.new(0, 0.35), NumberSequenceKeypoint.new(1, 0) }),
	}, M.engine.spots[1].part)

	-- цвета деталей болида, чтобы он темнел от огня
	M.carColors = {}
	for _, d in ipairs(car:GetDescendants()) do
		if d:IsA("BasePart") and d.Transparency < 1 and d ~= M.lamp and d.Name ~= "ERingDot" then M.carColors[d] = d.Color end
	end

	-- чужой болид на трассе
	local rc = m.RaceCar
	local pv = rc:GetPivot()
	M.race = { model = rc, x = 260, wait = 0.5, rot = pv - pv.Position, y = pv.Position.Y, z = pv.Position.Z }

	-- медики и маршалы
	M.amb = m.Ambulance
	M.marshals = { m.MarshalPowder, m.MarshalFoam }

	----------------------------------------------------------------
	-- Интерактивные предметы
	----------------------------------------------------------------
	-- красный флаг
	prompt(m.MarshalPost.FlagPole, "Пост маршалов", "Поднять красный флаг", Enum.KeyCode.E, 0.5, function(plr, p)
		M.red = true
		M.redT = M.t
		p:Destroy()
		say("Красный флаг! Гонка остановлена, болиды сбросили скорость. Маршалы бегут к болиду, медики уже едут.", "good")
		-- маршалы перебегают трассу к болиду
		walkTo(M.marshals[1], Vector3.new(-9, 0, 26), 14)
		walkTo(M.marshals[2], Vector3.new(14, 0, 24), 14)
		-- медики подъезжают по трассе
		slide(M.amb, Vector3.new(-212, 0, 0), 5)
	end)

	-- маршалы дают порошок и пену
	prompt(m.MarshalPowder.Torso, "Маршал", "Взять порошок", Enum.KeyCode.E, 0, function(plr)
		giveTool(plr, "powder")
		say("Маршал дал порошковый огнетушитель. Порошок за секунды сбивает открытое пламя!", "good", nil, plr)
	end)
	prompt(m.MarshalFoam.Torso, "Маршал", "Взять пену AFFF", Enum.KeyCode.E, 0, function(plr)
		giveTool(plr, "foam")
		say("Маршал дал пенный огнетушитель AFFF. Пена ложится плёнкой на топливо и остужает горячий карбон.", "good", nil, plr)
	end)
	-- пожарный щит с водой: доступен всегда
	prompt(m.FireBoard.WaterExt, "Пожарный щит", "Взять воду", Enum.KeyCode.E, 0, function(plr)
		giveTool(plr, "water")
		say("Водяной огнетушитель. Вода отлично остужает и проливает то, что тлеет.", "", nil, plr)
	end)

	-- лампа батареи: выключатель гибридной системы
	prompt(M.lamp, "Лампа батареи", "Обесточить болид", Enum.KeyCode.E, 0.3, function(plr, p)
		M.drainT = M.t
		p:Destroy()
		if M.pilot.state == "inside" then
			say("Пилот щёлкнул выключателем гибридной системы. Батарея разряжается, жди зелёную лампу!", "")
		else
			say("Ты отключил гибридную систему. Батарея разряжается, жди зелёную лампу!", "")
		end
	end)

	-- кольцо «E»: встроенный огнетушитель
	prompt(car.ERing, "Кольцо «E»", "Дёрнуть кольцо", Enum.KeyCode.R, 0.3, function(plr, p)
		M.ering = true
		p:Destroy()
		local e = M.engine
		e.fire = math.max(0, e.fire - 0.45)
		if e.fire < 0.05 then e.fire = 0 end
		e.heat = 0
		e.steamUntil = os.clock() + 2.5
		car.ERingDot.Color = Color3.fromRGB(201, 206, 216)
		say("Ты дёрнул кольцо «E», и встроенный огнетушитель залил батарею и мотор изнутри! Такое кольцо есть на каждом гоночном болиде.", "good")
	end)

	-- пилот: сначала снять руль, потом помочь выбраться
	M.pilot.prompt = prompt(m.Pilot.Helmet, "Пилот", "Снять руль", Enum.KeyCode.F, 0.4, function(plr, p)
		if not M.pilot.wheel then
			M.pilot.wheel = true
			setPromptText(p, "Помочь выбраться")
			say("Пилот снял руль: без этого из тесного кокпита не вылезти. Теперь помоги ему выбраться!", "")
			return
		end
		pilotExit(true)
	end)

	-- состояние для интерфейса
	setS("Red", false); setS("Safe", false); setS("Draining", false); setS("Ering", false)
	setS("Pilot", "inside"); setS("Damage", 0); setS("Time", 0); setS("Mistakes", 0)
end

----------------------------------------------------------------------
-- Пилот выбирается сам или с помощью игроков (никогда не погибает)
----------------------------------------------------------------------
pilotExit = function(rescued)
	local P = M.pilot
	if P.state ~= "inside" then return end
	P.state = rescued and "out" or "fled"
	setS("Pilot", P.state)
	if P.prompt then P.prompt:Destroy() end
	local mdl = P.model
	local side = M.car:GetPivot().RightVector
	if rescued then
		if M.safe then
			say("Лампа зелёная, и пилот спокойно выбрался из болида. Цел и машет команде!", "good")
		else
			say("Лампа красная, болид под током! Пилот выпрыгнул одним махом, не касаясь машины и земли одновременно. Так учат всех гонщиков.", "good")
		end
	else
		say("Пилот сам сбросил руль, выпрыгнул и убежал от огня к маршалам. Цел, но очень сердит!", "bad")
	end
	-- прыжок из кокпита вверх, вбок и на землю, потом к медикам или к посту
	slide(mdl, Vector3.new(0, 3.4, 0), 0.35, function()
		slide(mdl, side * 6 + Vector3.new(0, -2.1, 0), 0.5, function()
			local goal
			if rescued then
				goal = M.red and Vector3.new(26, 0, 12) or Vector3.new(-14, 0, 22)
				walkTo(mdl, goal, 9, function() P.arrived = true end)
			else
				walkTo(mdl, Vector3.new(-18, 0, 22), 16, function()
					walkTo(mdl, Vector3.new(-30, 0, -16), 16, function() P.arrived = true end)
				end)
			end
		end)
	end)
end

----------------------------------------------------------------------
-- Попадание струи
----------------------------------------------------------------------
local function knock(o, amount)
	if o.fire <= 0 then return end
	o.fire = o.fire - amount
	if o.fire <= 0.03 then
		o.fire = 0
		o.heat = 0
		o.steamUntil = os.clock() + 2.5
		say("{0}: пламя сбито!", "good", { o.name })
	end
end

local function showFoam(o)
	if o.id == "engine" then
		local c = M.car.EngineCover
		new("Part", { Name = "Foam", Anchored = true, CanCollide = false, CanQuery = false, Size = c.Size + Vector3.new(0.4, 0.4, 0.4),
			CFrame = c.CFrame, Color = Color3.fromRGB(255, 255, 255), Material = Enum.Material.SmoothPlastic, Transparency = 0.25 }, M.model)
	else
		local pz = M.puddle
		new("Part", { Name = "Foam", Anchored = true, CanCollide = false, CanQuery = false, Size = Vector3.new(pz.Size.X, 0.3, pz.Size.Z),
			CFrame = pz.CFrame + Vector3.new(0, 0.15, 0), Color = Color3.fromRGB(255, 255, 255), Material = Enum.Material.SmoothPlastic, Transparency = 0.2 }, M.model)
	end
end

local function shock(plr, s)
	s.stunUntil = os.clock() + 1.5
	stopSpray(s)
	M.sparks:Emit(40)
	local char = plr.Character
	local hrp = char and char:FindFirstChild("HumanoidRootPart")
	if hrp then
		local away = hrp.Position - M.car:GetPivot().Position
		away = Vector3.new(away.X, 0, away.Z)
		if away.Magnitude < 0.1 then away = Vector3.new(0, 0, -1) end
		char:PivotTo(hrp.CFrame + away.Unit * 7 + Vector3.new(0, 1.5, 0))
	end
	mistake("shock", "Лампа красная, болид под током! Вода ударила током. Сначала обесточь болид или бери порошок и пену.", nil)
end

local function hit(o, agent, dt, plr, s)
	if not M.firstSprayT then M.firstSprayT = M.t end
	if agent == "water" then
		if o.id == "engine" then
			if not M.safe then shock(plr, s) return end
			knock(o, 0.12 * dt)
			if o.fire > 0 then once("waterEngine", "Вода почти не берёт горящее топливо в моторе. Тут лучше порошок или пена.", "") end
		elseif o.id == "spill" then
			if o.fire > 0 then
				o.fire = math.min(1, o.fire + 0.25 * dt)
				M.spillGrow = math.min(1.8, M.spillGrow + 0.3 * dt)
				mistake("spillWater", "Вода разбрызгала горящее топливо по гравию! Топливо тушат порошком или пеной.", nil)
			end
		else
			knock(o, 0.45 * dt)
			o.wet = 1
		end
	elseif agent == "powder" then
		knock(o, KNOCK.powder[o.id] * dt)
		if o.id == "engine" then
			M.powderT = M.t
			if M.pilot.state == "inside" then once("cough", "Пилот закашлялся в облаке порошка! Помоги ему поскорее выбраться.", "") end
			if o.fire == 0 and not o.foamed then once("powderEngine", "Порошок сбил пламя! Но карбон и металл ещё раскалены: следом залей мотор пеной.", "good") end
		end
	elseif agent == "foam" then
		knock(o, KNOCK.foam[o.id] * dt)
		o.cover = math.min(1, o.cover + dt * 0.55)
		if o.id == "barrier" then
			o.wet = 1
		elseif o.cover >= 1 and o.fire == 0 and not o.foamed then
			o.foamed = true
			showFoam(o)
			if o.id == "engine" then
				if M.powderT then M.combo = true end
				setS("Foamed", true)
				say("Пена AFFF залила мотор плёнкой и остудила горячий карбон. Сам он больше не вспыхнет.", "good")
			else
				say("Пена закрыла топливо плёнкой: оно больше не загорится.", "good")
			end
		end
	end
end

local function pickTarget(p)
	local best, bestD, bestPrio = nil, math.huge, math.huge
	for _, o in ipairs(M.objs) do
		local d
		if o.id == "spill" then
			local pz = M.puddle
			d = boxDist(pz.CFrame * CFrame.new(0, 1.4, 0), Vector3.new(pz.Size.X, 3, pz.Size.Z), p)
		else
			d = boxDist(o.cf, o.size, p)
		end
		if d <= CFG.hitRadius then
			-- низко над землёй у лужи целимся в топливо, выше в болид
			local prio = o.prio
			if o.id == "spill" and p.Y < 1 then prio = 0 end
			if d < bestD - 0.05 or (math.abs(d - bestD) <= 0.05 and prio < bestPrio) then
				best, bestD, bestPrio = o, d, prio
			end
		end
	end
	return best
end

----------------------------------------------------------------------
-- Конец раунда
----------------------------------------------------------------------
local function endRound(win, reason)
	if phase ~= "play" then return end
	phase = "result"
	setS("Phase", "result")
	for _, s in pairs(SP) do stopSpray(s) end
	if not win and M.pilot.state == "inside" then pilotExit(false) end
	local stars = 0
	if win then
		stars = 1
		if M.damage <= 50 then stars = 2 end
		if M.damage <= 25 then stars = 3 end
	end
	local medals = {
		{ name = "Сначала красный флаг", got = M.redT ~= nil and (M.firstSprayT == nil or M.redT <= M.firstSprayT) },
		{ name = "Порошок, потом пена", got = M.combo },
		{ name = "Пилот спасён", got = M.pilot.state == "out" },
		{ name = "Барьер не загорелся", got = not M.barrier.everBurned },
		{ name = "Без ошибок", got = M.mistakeCount == 0 },
	}
	ResultEv:FireAllClients({ win = win, reason = reason, stars = stars, time = math.floor(M.t), damage = math.floor(M.damage), medals = medals, mistakes = M.mistakeCount })
	-- пилот машет команде
	local arm = M.pilot.model:FindFirstChild("ArmR")
	if win and arm and M.pilot.state == "out" then
		task.spawn(function()
			local base = arm.CFrame
			for i = 1, 24 do
				if not arm.Parent then return end
				arm.CFrame = base * CFrame.new(0, 1, 0) * CFrame.Angles(0, 0, math.rad(150 + math.sin(i) * 25)) * CFrame.new(0, -1, 0)
				task.wait(0.25)
			end
		end)
	end
end

----------------------------------------------------------------------
-- Главный цикл огня
----------------------------------------------------------------------
local fxAcc = 0

local function updateVisuals()
	local now = os.clock()
	for _, o in ipairs(M.objs) do
		for _, sp in ipairs(o.spots) do
			local f = o.fire
			sp.fire.Enabled = f > 0.01
			sp.fire.Size = 3 + f * 10
			sp.fire.Heat = 6 + f * 14
			sp.light.Brightness = f * 4
			local steaming = now < o.steamUntil
			sp.smoke.Enabled = f > 0.05 or steaming
			if steaming and f <= 0 then
				sp.smoke.Color = Color3.fromRGB(235, 235, 240)
				sp.smoke.Opacity = 0.15
			else
				sp.smoke.Color = (o.id == "barrier") and Color3.fromRGB(25, 25, 28) or Color3.fromRGB(80, 80, 86)
				sp.smoke.Opacity = 0.1 + f * 0.35
				sp.smoke.Size = 4 + f * 8
			end
		end
	end
	-- лужа растекается, если её поливали водой
	local g = M.spillGrow
	M.puddle.Size = Vector3.new(M.puddleSize.X * g, M.puddleSize.Y, M.puddleSize.Z * g)
	-- болид темнеет от огня
	local k = math.min(0.85, M.damage / 100)
	for p, c in pairs(M.carColors) do
		if p.Parent then p.Color = c:Lerp(Color3.fromRGB(40, 35, 32), k) end
	end
	-- лампа: красная, мигает жёлтым при разрядке, зелёная когда безопасно
	if M.safe then
		M.lamp.Color = Color3.fromRGB(124, 194, 67); M.lampLight.Color = M.lamp.Color
	elseif M.drainT then
		local on = math.floor(now * 4) % 2 == 0
		M.lamp.Color = on and Color3.fromRGB(255, 210, 63) or Color3.fromRGB(230, 59, 46); M.lampLight.Color = M.lamp.Color
	end
	-- флаг развевается
	if M.red then
		M.flag.CFrame = M.flagCF * CFrame.new(0, 6.4, 0) * CFrame.Angles(0, math.sin(now * 5) * 0.25, 0)
	end
	-- состояние для интерфейса
	setS("FEngine", M.engine.fire); setS("FSpill", M.spill.fire); setS("FBarrier", M.barrier.fire)
	setS("Damage", M.damage); setS("Time", M.t)
end

local function notDoneHint()
	local e = M.engine
	if not M.red then return "Огонь сбит, но гонка всё ещё идёт! Подними красный флаг на посту маршалов." end
	if M.pilot.state == "inside" then return "Пилот всё ещё в кокпите. Помоги ему выбраться!" end
	if not (M.safe or M.ering) then return "Батарея ещё может поджечь мотор. Обесточь болид лампой или дёрни кольцо «E»." end
	if not e.foamed then return "Мотор ещё раскалён. Залей его пеной, иначе вспыхнет снова." end
	if M.barrier.everBurned and M.barrier.wet <= 0 then return "Шины в барьере ещё тлеют внутри. Пролей их водой." end
	return nil
end

local function tickRace(dt)
	local R = M.race
	if R.x > -260 then
		R.x = R.x - dt * CFG.raceSpeed
	elseif not M.red then
		R.wait = R.wait - dt
		if R.wait <= 0 then
			R.x = 260
			R.wait = 1.4 + math.random() * 1.6
			local cols = { Color3.fromRGB(63, 169, 245), Color3.fromRGB(230, 59, 46), Color3.fromRGB(124, 194, 67), Color3.fromRGB(255, 157, 31), Color3.fromRGB(255, 255, 255) }
			local col = cols[math.random(1, #cols)]
			for _, d in ipairs(R.model:GetChildren()) do if d.Name == "Body" then d.Color = col end end
		end
	end
	R.model:PivotTo(CFrame.new(R.x, R.y, R.z) * R.rot)
	if R.x <= -255 or R.x >= 255 then return end
	-- болид проносится мимо игрока на трассе: игрока отбрасывает обратно за обочину
	for _, plr in ipairs(Players:GetPlayers()) do
		local char = plr.Character
		local hrp = char and char:FindFirstChild("HumanoidRootPart")
		if hrp and math.abs(hrp.Position.X - R.x) < 10 and math.abs(hrp.Position.Z - R.z) < 7 then
			local back = (hrp.Position.Z > 4) and 15 or -15
			char:PivotTo(CFrame.new(hrp.Position.X, 4, back) * (hrp.CFrame - hrp.Position))
			mistake("track", "Ух! Болид пронёсся прямо перед тобой. Пока гонка идёт, на трассу выходить нельзя: сначала красный флаг!", plr)
		end
	end
end

local function tickFire(dt)
	M.t = M.t + dt
	local e = M.engine
	-- рост огня
	for _, o in ipairs(M.objs) do
		if o.fire > 0 then o.fire = math.min(1, o.fire + o.grow * dt) end
	end
	-- огонь перекидывается
	for _, L in ipairs(M.links) do
		local a, b, k = L[1], L[2], L[3]
		if a.fire > 0 and b.fire <= 0 and not b.foamed then
			b.heat = b.heat + a.fire * k * dt
			if b.heat >= 1 then
				b.fire = 0.2
				b.heat = 0
				b.everBurned = true
				b.wet = 0
				if b.id == "barrier" then say("Загорелся шинный барьер! Шины горят долго и дают чёрный дым.", "bad")
				else say("{0} снова загорелось!", "bad", { b.name }) end
			end
		else
			b.heat = math.max(0, b.heat - 0.05 * dt)
		end
	end
	-- батарея и раскалённый карбон снова поджигают мотор
	if e.fire <= 0 then
		local battery = not (M.safe or M.ering)
		if battery or not e.foamed then
			M.refT = M.refT + dt
			if M.refT > CFG.reigniteTime then
				M.refT = 0
				e.fire = 0.3
				M.sparks:Emit(20)
				if battery then
					say("Повреждённая батарея снова подожгла мотор! Обесточь болид лампой или дёрни кольцо «E» на борту.", "bad")
				else
					say("Раскалённый карбон снова вспыхнул! Порошок сбивает пламя, но не охлаждает. Залей мотор пеной.", "bad")
				end
			end
		else
			M.refT = 0
		end
	else
		M.refT = 0
	end
	-- тлеющие шины, потушенные одним порошком
	local b = M.barrier
	if b.fire <= 0 and b.everBurned and b.wet <= 0 then
		b.smT = b.smT + dt
		if b.smT > CFG.smoulderTime then
			b.smT = 0
			b.fire = 0.25
			say("Шины в барьере тлели внутри и снова вспыхнули! Тлеющие шины проливают водой.", "bad")
		end
	else
		b.smT = 0
	end
	-- батарея разряжается
	if M.drainT and not M.safe and M.t - M.drainT >= CFG.drainTime then
		M.safe = true
		setS("Safe", true)
		say("Лампа зелёная! Болид обесточен: теперь его можно трогать, и батарея больше не подожжёт мотор.", "good")
	end
	setS("Draining", M.drainT ~= nil and not M.safe)
	setS("Ering", M.ering)
	setS("Red", M.red)
	-- ущерб
	M.damage = math.min(100, M.damage + (e.fire * 0.9 + M.spill.fire * 0.25 + b.fire * 0.45) * dt)
	-- пилоту жарко
	local P = M.pilot
	if P.state == "inside" and e.fire > 0.3 then
		P.heat = P.heat + dt * e.fire
		if P.heat > 9 then once("pilotHot", "Пилоту в кокпите становится жарко! Помоги ему выбраться.", "bad") end
		if P.heat > 18 then pilotExit(false) end
	end
	-- победа или подсказка, чего не хватает
	if e.fire <= 0 and M.spill.fire <= 0 and b.fire <= 0 then
		M.hintT = M.hintT + dt
		local need = notDoneHint()
		if not need then
			endRound(true, "Пожар потушен!")
			return
		end
		if M.hintT > 1.2 and not M.hintSaid then
			M.hintSaid = true
			say(need, "")
		end
	else
		M.hintT = 0
		M.hintSaid = false
	end
	if M.damage >= 100 then endRound(false, "Болид сгорел.") return end
	if M.t >= CFG.maxTime then endRound(false, "Время вышло.") return end
end

local function tickSprays(dt)
	local now = os.clock()
	for plr, s in pairs(SP) do
		if s.on then
			local char = plr.Character
			local hrp = char and char:FindFirstChild("HumanoidRootPart")
			local tool = equippedTool(plr)
			if not (hrp and tool and s.a1) or now < s.stunUntil then
				stopSpray(s)
			else
				local charge = (tool:GetAttribute("Charge") or 0) - dt / AGENTS[tool:GetAttribute("Agent")].secs
				tool:SetAttribute("Charge", math.max(0, charge))
				if charge <= 0 then
					stopSpray(s)
					say("Огнетушитель пуст! Возьми новый у маршалов или на пожарном щите.", "bad", nil, plr)
				else
					local from = hrp.Position
					local to = s.pos or from
					local v = to - from
					if v.Magnitude > CFG.sprayRange then to = from + v.Unit * CFG.sprayRange end
					s.a1.WorldPosition = to
					if phase == "play" and M then
						local o = pickTarget(to)
						if o then hit(o, tool:GetAttribute("Agent"), dt, plr, s) end
					end
				end
			end
		end
	end
end

RunService.Heartbeat:Connect(function(dt)
	tickSprays(dt)
	if not M then return end
	if phase == "play" or phase == "plan" then tickRace(dt) end
	if phase == "play" then tickFire(dt) end
	fxAcc = fxAcc + dt
	if fxAcc >= 0.1 then
		fxAcc = 0
		updateVisuals()
	end
end)

----------------------------------------------------------------------
-- Раунды по кругу
----------------------------------------------------------------------
local function clearRound()
	for _, s in pairs(SP) do stopSpray(s) end
	if M and M.model then M.model:Destroy() end
	M = nil
	for _, plr in ipairs(Players:GetPlayers()) do
		for _, holder in ipairs({ plr:FindFirstChildOfClass("Backpack"), plr.Character }) do
			if holder then for _, t in ipairs(holder:GetChildren()) do if isExtinguisher(t) then t:Destroy() end end end
		end
	end
end

local function countdown(name, secs)
	phase = name
	setS("Phase", name)
	for i = secs, 1, -1 do
		setS("Countdown", i)
		task.wait(1)
	end
	setS("Countdown", 0)
end

setS("Phase", "wait")

task.spawn(function()
	local first = true
	while true do
		if #Players:GetPlayers() == 0 then Players.PlayerAdded:Wait() end
		if first then task.wait(2) end
		setupRound()
		say("Болид вылетел с трассы и врезался в шинный барьер! Мотор горит, из бака течёт топливо, а пилот ещё в кокпите. По трассе всё ещё несутся болиды.", "")
		countdown("plan", first and CFG.planTime + 4 or CFG.planTime)
		first = false
		phase = "play"
		setS("Phase", "play")
		say("Вперёд! Действуйте вместе.", "good")
		while phase == "play" do task.wait(0.25) end
		countdown("result", CFG.resultTime)
		clearRound()
		for _, plr in ipairs(Players:GetPlayers()) do task.spawn(function() plr:LoadCharacter() end) end
		countdown("wait", CFG.waitTime)
	end
end)
