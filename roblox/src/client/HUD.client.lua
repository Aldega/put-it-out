-- Интерфейс игрока и прицеливание струи пальцем или мышью.
local Players = game:GetService("Players")
local RS = game:GetService("ReplicatedStorage")
local UIS = game:GetService("UserInputService")
local RunService = game:GetService("RunService")

local player = Players.LocalPlayer
local I18n = require(RS:WaitForChild("I18n"))
local Remotes = RS:WaitForChild("FireRemotes")
local SayEv = Remotes:WaitForChild("Say")
local SprayEv = Remotes:WaitForChild("Spray")
local ResultEv = Remotes:WaitForChild("Result")
local State = RS:WaitForChild("MissionState")

local lang = I18n.detect(player.LocaleId)
local function T(s, args) return I18n.t(lang, s, args) end

local INK = Color3.fromRGB(29, 27, 38)
local FONT = Enum.Font.GothamBlack

local function new(cls, props, parent)
	local o = Instance.new(cls)
	for k, v in pairs(props or {}) do o[k] = v end
	if parent then o.Parent = parent end
	return o
end

-- мультяшная плашка: скругление и толстый тёмный контур
local function toon(frame, radius, stroke)
	new("UICorner", { CornerRadius = UDim.new(0, radius or 14) }, frame)
	new("UIStroke", { Color = INK, Thickness = stroke or 3, ApplyStrokeMode = Enum.ApplyStrokeMode.Border }, frame)
	return frame
end

local function label(parent, props)
	local l = new("TextLabel", { BackgroundTransparency = 1, Font = FONT, TextColor3 = Color3.new(1, 1, 1), TextScaled = true, Text = "" }, parent)
	for k, v in pairs(props) do l[k] = v end
	if l.TextColor3 == Color3.new(1, 1, 1) then new("UIStroke", { Color = INK, Thickness = 2 }, l) end
	return l
end

local gui = new("ScreenGui", { Name = "FireHUD", ResetOnSpawn = false, IgnoreGuiInset = false, ZIndexBehavior = Enum.ZIndexBehavior.Sibling }, player:WaitForChild("PlayerGui"))

-- строка сверху: фаза и отсчёт
local banner = toon(new("Frame", { AnchorPoint = Vector2.new(0.5, 0), Position = UDim2.new(0.5, 0, 0, 6), Size = UDim2.new(0, 360, 0, 40), BackgroundColor3 = Color3.fromRGB(255, 138, 31) }, gui), 18)
local bannerText = label(banner, { Size = UDim2.new(1, -20, 1, -8), Position = UDim2.new(0, 10, 0, 4) })

-- панель слева: что горит
local panel = toon(new("Frame", { Position = UDim2.new(0, 10, 0, 56), Size = UDim2.new(0, 230, 0, 196), BackgroundColor3 = Color3.fromRGB(255, 249, 236) }, gui), 14)
local rows = {}
local function bar(y, key, color)
	local name = label(panel, { Position = UDim2.new(0, 10, 0, y), Size = UDim2.new(0, 110, 0, 20), TextXAlignment = Enum.TextXAlignment.Left, TextColor3 = INK })
	local back = toon(new("Frame", { Position = UDim2.new(0, 122, 0, y + 2), Size = UDim2.new(0, 96, 0, 16), BackgroundColor3 = Color3.fromRGB(220, 214, 200) }, panel), 8, 2)
	local fill = new("Frame", { Size = UDim2.new(0, 0, 1, 0), BackgroundColor3 = color, BorderSizePixel = 0 }, back)
	new("UICorner", { CornerRadius = UDim.new(0, 8) }, fill)
	local r = { name = name, key = key, fill = fill }
	table.insert(rows, r)
	return r
end
local rEngine = bar(10, "Болид", Color3.fromRGB(255, 120, 30))
local rSpill = bar(36, "Топливо", Color3.fromRGB(255, 120, 30))
local rBarrier = bar(62, "Шинный барьер", Color3.fromRGB(255, 120, 30))
local rDamage = bar(88, "Ущерб", Color3.fromRGB(122, 75, 214))
local pilotLine = label(panel, { Position = UDim2.new(0, 10, 0, 118), Size = UDim2.new(1, -20, 0, 20), TextXAlignment = Enum.TextXAlignment.Left, TextColor3 = INK })
local raceLine = label(panel, { Position = UDim2.new(0, 10, 0, 142), Size = UDim2.new(1, -20, 0, 20), TextXAlignment = Enum.TextXAlignment.Left, TextColor3 = INK })
local lampLine = label(panel, { Position = UDim2.new(0, 10, 0, 166), Size = UDim2.new(1, -20, 0, 20), TextXAlignment = Enum.TextXAlignment.Left, TextColor3 = INK })

-- сообщения по центру снизу
local msg = toon(new("Frame", { AnchorPoint = Vector2.new(0.5, 1), Position = UDim2.new(0.5, 0, 1, -96), Size = UDim2.new(0.6, 0, 0, 74), BackgroundColor3 = Color3.fromRGB(255, 249, 236), Visible = false }, gui), 16)
new("UISizeConstraint", { MaxSize = Vector2.new(720, 120), MinSize = Vector2.new(280, 50) }, msg)
local msgText = label(msg, { Size = UDim2.new(1, -24, 1, -12), Position = UDim2.new(0, 12, 0, 6), TextColor3 = INK, TextWrapped = true })
local msgUntil = 0

-- заряд огнетушителя
local charge = toon(new("Frame", { AnchorPoint = Vector2.new(0.5, 1), Position = UDim2.new(0.5, 0, 1, -176), Size = UDim2.new(0, 240, 0, 24), BackgroundColor3 = Color3.fromRGB(220, 214, 200), Visible = false }, gui), 10, 2)
local chargeFill = new("Frame", { Size = UDim2.new(1, 0, 1, 0), BackgroundColor3 = Color3.fromRGB(63, 169, 245), BorderSizePixel = 0 }, charge)
new("UICorner", { CornerRadius = UDim.new(0, 10) }, chargeFill)
local chargeText = label(charge, { Size = UDim2.new(1, -10, 1, -4), Position = UDim2.new(0, 5, 0, 2), ZIndex = 2 })

-- кнопки языка
local langBox = new("Frame", { AnchorPoint = Vector2.new(1, 0), Position = UDim2.new(1, -10, 0, 6), Size = UDim2.new(0, 150, 0, 34), BackgroundTransparency = 1 }, gui)
new("UIListLayout", { FillDirection = Enum.FillDirection.Horizontal, Padding = UDim.new(0, 6), HorizontalAlignment = Enum.HorizontalAlignment.Right }, langBox)
local langButtons = {}

-- окно итогов
local result = toon(new("Frame", { AnchorPoint = Vector2.new(0.5, 0.5), Position = UDim2.new(0.5, 0, 0.45, 0), Size = UDim2.new(0, 400, 0, 330), BackgroundColor3 = Color3.fromRGB(255, 249, 236), Visible = false }, gui), 22, 4)
local resTitle = label(result, { Position = UDim2.new(0, 16, 0, 12), Size = UDim2.new(1, -32, 0, 40), TextColor3 = INK })
local resStars = label(result, { Position = UDim2.new(0, 16, 0, 56), Size = UDim2.new(1, -32, 0, 50), TextColor3 = Color3.fromRGB(255, 200, 40) })
local resInfo = label(result, { Position = UDim2.new(0, 16, 0, 110), Size = UDim2.new(1, -32, 0, 22), TextColor3 = INK })
local resMedals = {}
for i = 1, 5 do
	resMedals[i] = label(result, { Position = UDim2.new(0, 24, 0, 140 + (i - 1) * 28), Size = UDim2.new(1, -48, 0, 24), TextXAlignment = Enum.TextXAlignment.Left, TextColor3 = INK })
end
local lastResult = nil

----------------------------------------------------------------------
-- Перевод подсказок над предметами и названий огнетушителей
----------------------------------------------------------------------
local prompts = {}
local function locPrompt(p)
	local function upd()
		local a, o = p:GetAttribute("ActionKey"), p:GetAttribute("ObjectKey")
		if a then p.ActionText = T(a) end
		if o then p.ObjectText = T(o) end
	end
	upd()
	p:GetAttributeChangedSignal("ActionKey"):Connect(upd)
	prompts[p] = upd
	p.Destroying:Connect(function() prompts[p] = nil end)
end
workspace.DescendantAdded:Connect(function(d) if d:IsA("ProximityPrompt") then locPrompt(d) end end)
for _, d in ipairs(workspace:GetDescendants()) do if d:IsA("ProximityPrompt") then locPrompt(d) end end

local function locTool(t)
	if t:IsA("Tool") and t:GetAttribute("NameKey") then t.Name = T(t:GetAttribute("NameKey")) end
end

----------------------------------------------------------------------
-- Сообщения
----------------------------------------------------------------------
local KIND = { good = Color3.fromRGB(214, 245, 190), bad = Color3.fromRGB(255, 205, 196) }
local function show(text, kind)
	msgText.Text = text
	msg.BackgroundColor3 = KIND[kind] or Color3.fromRGB(255, 249, 236)
	msg.Visible = true
	msgUntil = os.clock() + math.clamp(#text / 28, 4, 9)
end
SayEv.OnClientEvent:Connect(function(text, kind, args) show(T(text, args), kind) end)

----------------------------------------------------------------------
-- Итоги раунда
----------------------------------------------------------------------
local function renderResult()
	local r = lastResult
	if not r then return end
	resTitle.Text = T(r.reason or "")
	local s = ""
	for i = 1, 3 do s = s .. (i <= r.stars and "★" or "☆") end
	resStars.Text = r.win and s or "☆☆☆"
	resInfo.Text = T("Время: {0} с · Ущерб: {1}% · Ошибок: {2}", { r.time, r.damage, r.mistakes })
	for i, m in ipairs(r.medals) do
		if resMedals[i] then resMedals[i].Text = (m.got and "🏅 " or "○ ") .. T(m.name) end
	end
end
ResultEv.OnClientEvent:Connect(function(r)
	lastResult = r
	renderResult()
	result.Visible = true
end)

----------------------------------------------------------------------
-- Язык
----------------------------------------------------------------------
local function applyLang()
	for _, r in ipairs(rows) do r.name.Text = T(r.key) end
	for _, upd in pairs(prompts) do upd() end
	for _, holder in ipairs({ player:FindFirstChildOfClass("Backpack"), player.Character }) do
		if holder then for _, t in ipairs(holder:GetChildren()) do locTool(t) end end
	end
	for code, b in pairs(langButtons) do b.BackgroundColor3 = (code == lang) and Color3.fromRGB(255, 210, 63) or Color3.fromRGB(255, 249, 236) end
	renderResult()
end
for _, code in ipairs({ "ru", "en", "es" }) do
	local b = toon(new("TextButton", { Size = UDim2.new(0, 44, 0, 32), Text = string.upper(code), Font = FONT, TextScaled = true, TextColor3 = INK, AutoButtonColor = true }, langBox), 10, 3)
	langButtons[code] = b
	b.Activated:Connect(function() lang = code; applyLang() end)
end

----------------------------------------------------------------------
-- Огнетушитель: держи кнопку мыши или палец на экране и води струёй
----------------------------------------------------------------------
local spraying = false
local currentTool = nil
local aimScreen = nil
local touchInput = nil
local sendT = 0
local hintShown = false

local function aimPoint()
	local cam = workspace.CurrentCamera
	local ray
	if aimScreen then
		ray = cam:ScreenPointToRay(aimScreen.X, aimScreen.Y)
	else
		local m = UIS:GetMouseLocation()
		ray = cam:ViewportPointToRay(m.X, m.Y)
	end
	local params = RaycastParams.new()
	params.FilterType = Enum.RaycastFilterType.Exclude
	local ignore = { workspace:FindFirstChild("SprayFX") }
	if player.Character then table.insert(ignore, player.Character) end
	params.FilterDescendantsInstances = ignore
	local hit = workspace:Raycast(ray.Origin, ray.Direction * 300, params)
	if hit then return hit.Position end
	return ray.Origin + ray.Direction * 60
end

local function setSpray(on)
	if spraying == on then return end
	spraying = on
	local hum = player.Character and player.Character:FindFirstChildOfClass("Humanoid")
	if hum then hum.AutoRotate = not on end
	SprayEv:FireServer(on, aimPoint())
end

local function hookTool(t)
	if not (t:IsA("Tool") and t:GetAttribute("Agent")) or t:GetAttribute("Hooked") then return end
	t:SetAttribute("Hooked", true)
	locTool(t)
	t.Equipped:Connect(function()
		currentTool = t
		if not hintShown then
			hintShown = true
			show(T("Зажми кнопку мыши или палец на экране и наводи струю на огонь."), "")
		end
	end)
	t.Unequipped:Connect(function() if currentTool == t then currentTool = nil end; setSpray(false) end)
	t.Activated:Connect(function() setSpray(true) end)
	t.Deactivated:Connect(function() setSpray(false) end)
	if t.Parent == player.Character then currentTool = t end
end

local function watch(holder)
	if not holder then return end
	for _, c in ipairs(holder:GetChildren()) do hookTool(c) end
	holder.ChildAdded:Connect(hookTool)
end
watch(player:WaitForChild("Backpack"))
if player.Character then watch(player.Character) end
player.CharacterAdded:Connect(function(c)
	spraying = false
	currentTool = nil
	watch(c)
	watch(player:WaitForChild("Backpack"))
end)

UIS.InputBegan:Connect(function(input, processed)
	if input.UserInputType == Enum.UserInputType.Touch and not processed then
		touchInput = input
		aimScreen = Vector2.new(input.Position.X, input.Position.Y)
	end
end)
UIS.InputChanged:Connect(function(input)
	if input.UserInputType == Enum.UserInputType.MouseMovement then
		aimScreen = Vector2.new(input.Position.X, input.Position.Y)
	elseif input == touchInput then
		aimScreen = Vector2.new(input.Position.X, input.Position.Y)
	end
end)
UIS.InputEnded:Connect(function(input)
	if input == touchInput then touchInput = nil end
end)

----------------------------------------------------------------------
-- Каждый кадр
----------------------------------------------------------------------
local function fmtTime(t)
	t = math.floor(t or 0)
	return string.format("%d:%02d", math.floor(t / 60), t % 60)
end

RunService.RenderStepped:Connect(function(dt)
	-- струя: поворачиваем персонажа к цели и шлём точку прицела
	if spraying then
		local char = player.Character
		local hrp = char and char:FindFirstChild("HumanoidRootPart")
		local target = aimPoint()
		if hrp then
			local p = hrp.Position
			local flat = Vector3.new(target.X, p.Y, target.Z)
			if (flat - p).Magnitude > 1 then hrp.CFrame = CFrame.lookAt(p, flat) end
		end
		sendT = sendT + dt
		if sendT > 0.08 then sendT = 0; SprayEv:FireServer(true, target) end
	end

	-- строка сверху
	local ph = State:GetAttribute("Phase") or "wait"
	local cd = State:GetAttribute("Countdown") or 0
	if ph == "plan" then
		bannerText.Text = T("Осмотрись и составь план: {0}", { cd })
		result.Visible = false
	elseif ph == "play" then
		bannerText.Text = T("Авария Ф-1 · {0}", { fmtTime(State:GetAttribute("Time")) })
	elseif ph == "result" then
		bannerText.Text = T("Следующая миссия через {0}", { cd })
	else
		bannerText.Text = T("Миссия начнётся через {0}", { cd })
	end

	-- панель
	local function setBar(r, v) r.fill.Size = UDim2.new(math.clamp(v or 0, 0, 1), 0, 1, 0) end
	setBar(rEngine, State:GetAttribute("FEngine"))
	setBar(rSpill, State:GetAttribute("FSpill"))
	setBar(rBarrier, State:GetAttribute("FBarrier"))
	setBar(rDamage, (State:GetAttribute("Damage") or 0) / 100)
	local ps = State:GetAttribute("Pilot") or "inside"
	local pilotTexts = { inside = "Пилот: в кокпите", out = "Пилот: спасён", fled = "Пилот: убежал сам" }
	pilotLine.Text = T(pilotTexts[ps] or "")
	raceLine.Text = T(State:GetAttribute("Red") and "Гонка: красный флаг" or "Гонка: идёт")
	local lampText = "Лампа: красная"
	if State:GetAttribute("Safe") then lampText = "Лампа: зелёная"
	elseif State:GetAttribute("Draining") then lampText = "Лампа: мигает" end
	lampLine.Text = T(lampText)

	-- заряд
	if currentTool and currentTool.Parent == player.Character then
		local c = currentTool:GetAttribute("Charge") or 0
		charge.Visible = true
		chargeFill.Size = UDim2.new(math.clamp(c, 0, 1), 0, 1, 0)
		chargeText.Text = T("Заряд {0}%", { math.floor(c * 100 + 0.5) })
	else
		charge.Visible = false
	end

	if msg.Visible and os.clock() > msgUntil then msg.Visible = false end
end)

applyLang()
