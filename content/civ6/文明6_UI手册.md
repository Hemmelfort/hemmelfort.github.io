---
title: 文明6 UI手册
date: 2021-10-02
draft: false
author: Hemmelfort
---



# 文明6 UI手册



## 前言

由于《文明6》关于 UI 的内容比较多，所以本文至今还是个半成品，相关内容都还在不断完善中。



[toc]





## 构建界面

### modinfo

#### 替换原来的 lua 文件

```xml
		<ReplaceUIScript id="Expansion2_RazeCity">
			<Properties>
				<LuaContext>RazeCity</LuaContext>
				<LuaReplace>UI/Replacements/RazeCity_Expansion2.lua</LuaReplace>
			</Properties>
		</ReplaceUIScript>
```

- 自己加入的 lua 文件不需要 File 标签，而是用 LuaReplace。


#### 替换原来的 xml 文件

好像是用 `<ImportFiles>` 操作


#### 添加新界面

```xml
        <AddUserInterfaces id="UI">
            <Properties>
                <Context>InGame</Context>    <!--必须！-->
            </Properties>
            <File>你的xml文件.xml</File>
        </AddUserInterfaces>
```



### 在 xml 文件中包含另一个 xml 文件

```xml
<LuaContext ID="MapSelectWindow" FileName="MapSelect" Hidden="1"/>
```

另一个文件为 `MapSelect.xml`。



### FrontEnd Action

#### 分辨率与刷新率

修改分辨率、刷新率：

```lua
Options.SetAppOption("Video", "RenderWidth", 1366);
Options.SetAppOption("Video", "RenderHeight", 768);
Options.SetGraphicsOption("Video", "RefreshRateInHz", 60);

-- Apply the graphics options (modifies in-memory values and modifies the engine, but does not save to disk)
local bSuccess = Options.ApplyGraphicsOptions();
print('ApplyGraphicsOptions:', bSuccess);
```

获取分辨率、刷新率：

```lua
local current_width = Options.GetAppOption("Video", "RenderWidth");
local current_height = Options.GetAppOption("Video", "RenderHeight");
local refresh_rate = Options.GetGraphicsOption("Video", "RefreshRateInHz");

-- 这个分辨率是哪的？
local display_width  = Options.GetDisplayWidth();
local display_height = Options.GetDisplayHeight();
```

#### 其他

```lua
-- 恢复分辨率
function RevertGraphicsChanges()
    -- Revert the graphics option changes
    Options.RevertResolutionChanges();

    -- Save after reverting the options to make sure they are valid
    Options.SaveOptions();
end

-- 坚持画质的更改？？
function KeepGraphicsChanges()
    -- Make sure the next game start uploads the changed settings telemetry
    Options.SetAppOption("Misc", "TelemetryUploadNecessary", 1);

    -- Save after applying the options to make sure they are valid
    Options.SaveOptions();
end


-- 修改音量为50
Options.SetAudioOption("Sound", "Master Volume", 50.0, 1);

-- 修改快速战斗、移动
UserConfiguration.SetValue("QuickCombat", Options.GetUserOption("Gameplay", "QuickCombat"));
UserConfiguration.SetValue("QuickMovement", Options.GetUserOption("Gameplay", "QuickMovement"));
```



### Instance 用法1

#### 在 xml 文件中设置一个实例

```xml
<!--父控件-->
<Grid ID="MapInfoPanel" Style="DecoGrid" Size="260,parent" Anchor="R,C" Color="30,66,96,255" StackGrowth="Bottom">
    <!--此处省略500字-->
</Grid>

<!--实例。注意它们的ID就行-->
<Instance Name="MapInfoInstance">
    <Container ID="MapContainer" Anchor ="C,T" Size ="240,160" Offset="0,50">
        <Image ID="MapImagePreview" Anchor ="C,T" Texture="Map_4LeafClover" TextureOffset="0,0"/>
        <Grid ID ="MapNameContainer" Anchor="C,B" Size="255,40" Texture="Controls_DecoFrame" >
            <Label ID="MapName" Anchor="C,C" String=" "/>
        </Grid>
    </Container>
</Instance>
```

#### 在 lua 文件中调用实例管理器 InstanceManager

参数：

- instanceName：    xml 中定义的 Instance 的 Name
- rootControlName： 该 Instance 的根控件的 ID
- ParentControl：   该 Instance 的父控件？

```lua
include("InstanceManager");
m_mapInfoIM = InstanceManager:new("MapInfoInstance", "MapContainer", Controls.MapInfoPanel);
```

#### 获取实例

```lua
local m = m_mapInfoIM:GetInstance();
```

#### 修改实例

```lua
m.MapName:SetText(Locale.Lookup(kMapData.RawName));
m.MapDescription:SetText(Locale.Lookup(kMapData.RawDescription));
m.MapImagePreview:SetTexture(kMapData.Texture);
```

#### 重置实例

```
m_mapInfoIM:ResetInstances();
```

#### 释放实例？？

```
m_mapInfoIM:ReleaseInstance(m);
```



### Instance 用法2

（详见官方文档 Forge UI\Controls -> instance）

xml 文件：

```xml
<Instance Name="MyInstance">
    <Bar ID="TopControl" Size="10,10" Hidden="1"/>
</Instance>

<Stack ID="MyStack">
    <MakeInstance Name="MyInstance"/>
</Stack>
```

lua 文件：

```lua
local myInstance:table = {};

ContextPtr:BuildInstanceForControl("MyInstance", myInstance, Controls.MyStack);

myInstance.UnitActionIcon:SetTexture( IconManager:FindIconAtlas(action.IconId, 38) );
myInstance.UnitActionButton:SetDisabled( action.Disabled );
```






### PopupDialog

分为 PopupDialog 和 PopupDialogInGame，二者的区别如下：

- PopupDialog creates a dialog inline to your context.
- PopupDialogInGame creates a dialog within the context of InGame.

它们在使用前都要先导入一个文件：

```lua
include("PopupDialog")
```


#### PopupDialog （待研究）

是否还要在 xml 里面设置？

```xml
<Include File="PopupDialog" />
```



#### PopupDialogInGame

##### 基本用法

```lua
include("PopupDialog");

local pPopupDialog = PopupDialogInGame:new("UnitCaptured");

pPopupDialog:AddTitle("Title");
pPopupDialog:AddText( "mmmmmmmm" );
pPopupDialog:AddDefaultButton("hehe",  function() end );
pPopupDialog:Open();
```

new 里面可能是 Context，而且是已存在的 Context。用别人的 Context 不会影响到别人，但Events 里绑定的话就会。

- AddConfirmButton
- AddCancelButton
- AddCustomButton

##### ShowOkDialog

`PopupDialogInGame:ShowOkDialog( text:string, callbackOk:ifunction )`

##### ShowOkCancelDialog

`PopupDialogInGame:ShowOkCancelDialog( text:string, callbackOk:ifunction, callbackCancel:ifunction )`

##### ShowYesNoDialog

`PopupDialogInGame:ShowYesNoDialog( text:string, callbackOk:ifunction, callbackCancel:ifunction )`

##### AddCountDown

慎用。（尚不清楚为什么无法释放焦点）

`PopupDialogInGame:AddCountDown(startValue:number, callback:ifunction)`


#### 原理

分析源码可得：

```lua
m_options = {}

-- AddText
table.insert(self.m_options, { Type = "Text", Content = message });

-- AddDefaultButton
table.insert(self.m_options, {Type="Button", Content=label, Callback=callback, CommandString="_CMD_DEFAULT"});

LuaEvents.OnRaisePopupInGame('abc', m_options)
```



### 弹出式消息

一个带移动和显隐效果的弹出式消息窗口：

```xml
<Context Style="FontNormal20">
	<AlphaAnim AlphaBegin="0" AlphaEnd="1" Function="Root" Speed="2" Cycle="Once" Size="parent,parent" ID="AlphaIn" Anchor="C,C" >
		<SlideAnim Begin="0,40" End="0,0"  Speed="1" Cycle="Once" Size="parent,parent" ID="SlideIn">
			<AlphaAnim AlphaBegin="1" AlphaEnd="0"  Pause="4" Speed="2" Cycle="Once" Size="parent,parent" ID="AlphaOut">
				<SlideAnim Begin="0,0" End="0,0"  Pause="4" Speed="2" Cycle="Once" Size="parent,parent" ID="SlideOut">
					<!-- Window Containers -->
					<Grid ID="Root" Style="DropShadow" Size="750,150" Offset="0,0" Anchor="C,C" Hidden="1" Color="255,255,255,70">
						<Label String="UNKNOWN TURN" Style="ShellHeader" Offset="0,2"  Anchor="C,C" ID="NewTurnLabel"/>
					</Grid>
				</SlideAnim>
			</AlphaAnim>
		</SlideAnim>
	</AlphaAnim>
</Context>
```

控制方式：

```lua
function ShowNewTurnPanel()
    Controls.NewTurnLabel:SetText('ShowNewTurnPanel');
    Controls.Root:SetHide(false);    -- Root何来？

	Controls.AlphaIn:SetToBeginning();
	Controls.SlideIn:SetToBeginning();
	Controls.AlphaOut:SetToBeginning();
	Controls.SlideOut:SetToBeginning();
	Controls.AlphaIn:Play();
	Controls.SlideIn:Play();
	Controls.AlphaOut:Play();
	Controls.SlideOut:Play();
end

local ctr = ContextPtr:LookUpControl("/InGame/Screens")
Controls.AlphaIn:ChangeParent(ctr)

```



### 弹出界面（Context）

新建一个 Context 界面，并加塞到窗口列队中。

```lua
function Show()
    UIManager:QueuePopup(ContextPtr, PopupPriority.Current)
end

function Hide()
    UIManager:DequeuePopup(ContextPtr)
end
```

其中 ContextPtr 指向当前的这个 Context。

这样就不用像 LookUpControl 并 ChangeParent 那样附加到别人身上了。

QueuePopup 的第三个参数：

- AlwaysVisibleInQueue = true
- AlwaysInputInQueue = true
- RenderAtCurrentParent = true
- InputAtCurrentParent = true
- FileType = SaveFileTypes.GAME_CONFIGURATION
- DelayShow = true 
- GameId





### LuaEvents



`LuaEvents` 表可以创建、传递自定义事件，但不能在 Gameplay 和 UI 环境之间传递！

下面创建一个事件 `MyCustomEvent`，其中接收方（负责处理事件）如下：

```lua
function FunctionReceiver(PlotX, PlotY)
    UI.AddWorldViewText(0, "Yeah!!", PlotX, PlotY)
end

-- 信号绑定函数。同时也有 Remove 方法
-- 没错，直接命名一个事件（如下面的MyCustomEvent），然后再Add就算是创建了
LuaEvents.MyCustomEvent.Add(FunctionReceiver)
```

发送方：

```lua
function FunctionSender(owner, cityID, i, j, k, isSelected, isEditable)
    if isSelected and (owner == 0) then
        local pCity = CityManager.GetCity(owner, cityID)
        local PlotX = pCity:GetX()
        local PlotY = pCity:GetY()

        LuaEvents.MyCustomEvent(PlotX, PlotY)    -- 发射信号
    end
end

Events.CitySelectionChanged.Add(FunctionSender)
```

> LuaEvents 一般用于调用另一个 Context 的方法，如点击一个按钮后打开另一个 Context 的页面，就可以通过 LuaEvents 来实现。






### 输入响应

输入响应是针对 Context 而言的。

输入响应要先设定一个回调函数，它返回 true 或 false。

- `true`: 该输入已被处理。
- `false`: 该输入未被处理，交由其他 Context 来处理。

根据回调函数所接收的参数的不同，可以分为两种情况：

#### 方式1 （简单）

```lua
function InputHandler( uiMsg, wParam, lParam )
	if (uiMsg == KeyEvents.KeyUp) then
		if (wParam == Keys.VK_ESCAPE) then
			print("hehe");
			return true;
		end
	end
	return false;
end

ContextPtr:SetInputHandler( InputHandler );
```

uiMsg 还可以是：（MouseEvents 见附录）

- MouseEvents.MouseMove
- MouseEvents.LButtonDown
- MouseEvents.LButtonDoubleClick

KeyEvents 的内容如下：（Keys 见附录）

- KeyUp
- KeyDown

第三个参数是未解之谜。

#### 方式2

方式 2 只接收一个 table 类型的参数。

```lua
function OnInputHandler( pInputStruct:table )
	local uiMsg = pInputStruct:GetMessageType();

	if uiMsg == KeyEvents.KeyUp then
	    if pInputStruct:GetKey() == Keys.VK_ESCAPE then
    		return true
    	end
	end;

	return false;
end

ContextPtr:SetInputHandler(OnInputHandler, true);
```

**注意**：此时 SetInputHandler 的第二个参数是 true。

幺蛾子：官方在 DLC2 中 DisloyalCityChooser.lua 文件的写法：

```lua
function OnInputHandler( uiMsg, wParam, lParam )
    if uiMsg == KeyEvents.KeyUp then
        if wParam == Keys.VK_ESCAPE then
            OnClose();
        end
    end
    return true;
end

ContextPtr:SetInputHandler( OnInputHandler, true );    -- 难道不是false？？
```



### 快捷键

FrontEnd Action 的部分：

```xml
<InputCategories>
	<Row CategoryId="CategoryTest" Name="Test Hotkeys" Visible="1" SortIndex="0"/>
</InputCategories>

<InputActions>
    <Row ActionId="ActionTest" Name="Action Name" Description="Action Description" CategoryId="CategoryTest" ContextId="World" />
</InputActions>
```

InGame Action 的部分：

```lua
function OnInputActionTriggered(actionId)
    if (actionId == Input.GetActionId('ActionTest')) then
        print('ActionTest is on!')
    end
end

Events.InputActionTriggered.Add(OnInputActionTriggered)
```



### AdvanceSetup 高级设置界面

在高级设置界面加入可选的设置项。

```xml
<!--先确定要添加的项的名称，及其值的范围-->
<DomainRanges>
    <Row Domain="ExcitedLevelRange" MinimumValue="0" MaximumValue="9" />
</DomainRanges>

<Parameters>
    <Row ParameterId="ExcitedLevel"
    Name="LOC_EXCITED_LEVEL_NAME" Description="LOC_EXCITED_LEVEL_DESC"
    Domain="ExcitedLevelRange" DefaultValue="0"
    ConfigurationGroup="Game" ConfigurationId="excited_level" GroupId="GameOptions"/>
</Parameters>
```

用 lua 访问

```lua
local confRate = GameConfiguration.GetValue('excited_level')
```

TODO: 测试一下重新加载存档后这个值会不会变。

### ImportFiles 导入图片

先准备一个 dds 图片（如 TESTIMG.dds），然后在 modinfo 中导入：

```xml
    <ImportFiles id="TESTIMG">
        <File>TESTIMG.dds</File>
    </ImportFiles>
```

在 UI 中使用：

```xml
<Image ID="TESTIMG" Anchor="B,L" Size="256,256" Texture="TESTIMG.dds"/>
```

> 别忘了把它加到 modinfo 的文件清单中。



### 在 UnitActionPanel 上插入按钮（未成功）

InstanceManager:new(这里面都是些什么参数？？)

```lua
local giftActionIM = InstanceManager:new("UnitActionInstance", "UnitActionButton",
Controls.GiftSecondaryActionsStack);

	-- Some sort of lua-singleton version i guess...
	giftActionIM:DestroyInstances();

	-- Get an button instance from the instance-manager
	local instance = giftActionIM:GetInstance();
	instance.UnitActionIcon:SetIcon("ICON_UNITCOMMAND_GIFT");
	instance.UnitActionButton:RegisterCallback(Mouse.eLClick, function()end);
```













---
## Tables

### UI

#### 主要方法

```lua
UI.PanMap( panX, panY );
UI.SpinMap( 0.9, 0.0 ); -- 3.6 means 360 degree
UI.SetMapZoom(0.5, 0.0, 0.0);
UI.SetFixedTiltMode( true );

UI.LookAtPosition( wx, wy );
UI.FocusMap( wx, wy );
UI.LookAtPlot(hexX, hexY);    -- 第三个参数：zoom

UI.SelectUnit(pUnit);
UI.DeselectUnit(pUnit);
UI.SelectCity(pCity);

UI.SetWorldRenderView( WorldRenderView.VIEW_2D );

local x, y = UI.GetRegionCenter({100,105}) --获取一堆格位的中心位置（返回像素坐标）
```

Selected:

```lua
UI.SetInterfaceMode(...)
UI.DeselectAllCities();

local plotId:number = UI.GetCursorPlotID();
local interfaceMode = UI.GetInterfaceMode();
local pSelectedUnit = UI.GetHeadSelectedUnit();
```

Audio parameter:

```lua
UI.SetSoundStateValue("Game_Views", "Normal_View")
UI.PlaySound("Play_ADVISOR_LINE_LISTENER_9")
```

#### 高亮格位

```lua
local iX = 49
local iY = 32
plotID = Map.GetPlotIndex(iX, iY)
on = true
highlight = PlotHighlightTypes.MOVEMENT;
UI.HighlightPlots(highlight, on, { plotID } );
```



#### 在地图上显示文本

```lua
function CastText(szText, iPlotX, iPlotY)
    --正常状态下的文字颜色
    --颜色名如COLOR_MAP_LABEL_FILL在Colors表中定义
    local ColorSet_Main = {
        PrimaryColor   = UI.GetColorValue("COLOR_MAP_LABEL_FILL");
        SecondaryColor = UI.GetColorValue("COLOR_MAP_LABEL_STROKE");
    }

    --FOW状态下的文字颜色
    local ColorSet_FOW = {
        PrimaryColor   = UI.GetColorValue("COLOR_MAP_LABEL_FILL_FOW");
        SecondaryColor = UI.GetColorValue("COLOR_MAP_LABEL_STROKE_FOW");
    }
    
    --字体参数
    local FontParams = {
        FontSize       = 12.0,		--字体大小
        Leading        = 12.0,		--？？
        Kerning        = 5.33,		--间距
        WrapMode       = "Wrap",	--自动换行（设为Truncate可以截取）
        TargetWidth    = 128,		--目标区域的宽度（决定要不要截取）
        Alignment      = "Center",	--对齐方式
        ColorSet       = ColorSet_Main,
        FOWColorSet    = ColorSet_FOW,
        FontStyle      = "Stroke",	--字体风格（另有Shadow、Glow等）
    };

    --文字要显示在哪个图层上（这里以国家公园图层为例）
    local pOverlay = UILens.GetOverlay('MapLabelOverlay_NationalParks');
    local x, y = UI.GridToWorld(iPlotX, iPlotY);  --格位位置转像素坐标
    pOverlay:ClearAll();	--清除后所有国家公园的名字都不显示了
    pOverlay:CreateTextAtPos(szText, x, y, FontParams);	--把文字显示出来
end

CastText('这里是要显示的文本', 20, 21)
```

其他可以显示的图层包括但不限于：

- MapLabelOverlay_NaturalWonders
- MapLabelOverlay_Rivers
- MapLabelOverlay_Volcanoes
- MapLabelOverlay_Continents
- MapLabelOverlay_Religions



#### 隐藏城市边界

```lua
local pOverlay = UILens.GetOverlay('CultureBorders');
pOverlay:SetVisible(false);
```



### UILens

`UILens` 的可用方法：

```lua
['ClearHex', 'ClearHexes', 'ClearLayerHexes', 'ClearPressureWaves', 'CreateLensLayerHash', 'CreatePressureWaves',
'FocusCity', 'FocusHex', 'GetOverlay', 'IsLayerOn', 'IsLensActive', 'IsPlayerLensSetToActive', 'RestoreActiveLens',
'SaveActiveLens', 'SetActive', 'SetAdjacencyBonusDistict', 'SetDesaturation', 'SetLayerGrowthHex',
'SetLayerHexes', 'SetLayerHexesArea', 'SetLayerHexesColoredArea', 'SetLayerHexesPath',
'ToggleLayerOff', 'ToggleLayerOn', 'UnFocusCity', 'UnFocusHex']
```

#### 用法

```lua
-- 创建
local ML_LENS_LAYER = UILens.CreateLensLayerHash("Hex_Coloring_Appeal_Level")

-- 打开
UILens.ToggleLayerOn(ML_LENS_LAYER)

-- 关闭
if UILens.IsLayerOn(ML_LENS_LAYER) then
    UILens.ToggleLayerOff(ML_LENS_LAYER);
end
```

`CreateLensLayerHash` 在游戏中的可用项：

```lua
['Adjacency_Bonus_Districts', 'Attack_Range',
'Citizen_Management', 'City_Details', 'City_Yields', 'Cultural_Identity_Lens',
'Districts', 'Districts_Campus', 'Empire_Details',
'Hex_Coloring_Appeal_Level', 'Hex_Coloring_Attack', 'Hex_Coloring_Continent', 'Hex_Coloring_Government', 'Hex_Coloring_Great_People', 'Hex_Coloring_Movement', 'Hex_Coloring_Owning_Civ', 'Hex_Coloring_Placement', 'Hex_Coloring_Religion', 'Hex_Coloring_Water_Availablity',
'Loyalty_FreeCity_Warning', 'MapLabels_NationalParks', 'MapLabels_NaturalWonders', 'Map_Hex_Mask', 'Movement_Path', 'Movement_Range', 'Movement_Zone_Of_Control',
'Numbers', 'Purchase_Plot', 'Selection', 'Tourist_Tokens', 'TradeRoutes',
'Units_Archaeology', 'Units_Civilian', 'Units_Military', 'Units_Religious', 'Yield_Icons']
```



### UIManager

> 注意： `UIManager` 后面只用冒号。

```
['ClearPopupChangeHandler', 'DequeuePopup', 'DisablePopupQueue',
'GetControlUnderMouse', 'GetFontFamilyFromStyle', 'GetModalContexts', 'GetMouseOverControls', 'GetMouseOverWorld', 'GetMousePos', 'GetNormalizedMousePos', 'GetPopupStack', 'GetRootContexts', 'GetScreenSizeVal',
'IsInPopupQueue', 'IsPopupQueueDisabled', 'Log', 'PopModal', 'PushModal', 'QueuePopup',
'SetGlobalInputHandler', 'SetPopupChangeHandler', 'SetUICursor', 'ShowDelayedPopups']
```

#### QueuePopup
```lua
	local loadGameMenu = ContextPtr:LookUpControl( "/FrontEnd/MainMenu/LoadGameMenu" );
	local kParameters = {
		FileType = SaveFileTypes.GAME_CONFIGURATION
	};

	UIManager:QueuePopup(loadGameMenu, PopupPriority.Current, kParameters);
```

#### DequeuePopup
```lua
if ContextPtr:IsVisible() then
    UIManager:DequeuePopup( ContextPtr );
end
```

#### 设置光标

```lua
UIManager:SetUICursor(CursorTypes.RANGE_ATTACK)
```



### ContextPtr

```lua
	ContextPtr:SetInputHandler( OnInputHandler, true );
	ContextPtr:SetShowHandler(OnShow);
	ContextPtr:SetHideHandler(OnHide);
	ContextPtr:SetInitHandler(OnInit);
	ContextPtr:SetRefreshHandler( OnRefresh );
	ContextPtr:SetShutdown(OnShutdown);
```



### IconManager

图标管理器。

```lua
textureOffsetX, textureOffsetY, textureString = IconManager:FindIconAtlas("ICON_STRENGTH",22);
```



### ExposedMembers

用于在 Gameplay 和 UI 环境之间相互访问。

在 Gameplay 环境定义函数：

```lua
function RestoreMovement(playerID, unitID)
    local pUnit = UnitManager.GetUnit(playerID, unitID)
    UnitManager.RestoreMovementToFormation(pUnit)
end

ExposedMembers.LO = ExposedMembers.LO or {}
ExposedMembers.LO.RestoreMovement = RestoreMovement
```

在 UI 环境调用：

```lua
ExposedMembers.LO.RestoreMovement(playerID, unitID)
```

> 注意：该方法只能传递 lua 类型的数据，如数字、字符串。传递 C++ 版 table 类型（如 pUnit）会失败。



### GameConfiguration

游戏局相关配置项。

```
['AddEnabledMods',
'GetCalendarType', 'GetEnabledMods', 'GetGameSpeedType', 'GetGameState', 'GetHiddenPlayerCount', 'GetHumanPlayerIDs', 'GetMultiplayerPlayerIDs', 'GetParticipatingPlayerCount', 'GetParticipatingPlayerIDs', 'GetPausePlayer', 'GetRuleSet', 'GetStartEra', 'GetStartTurn', 'GetTeamName', 'GetTeamPlayerCount', 'GetValue',
'IsAnyMultiplayer', 'IsHotseat', 'IsInternetMultiplayer', 'IsLANMultiplayer', 'IsNetworkMultiplayer', 'IsPaused', 'IsPlayByCloud', 'IsSavedGame', 'IsWorldBuilderEditor',
'RegenerateSeeds', 'RemovePlayer',
'SetGameSpeedType', 'SetHandicapType', 'SetMaxTurns', 'SetParticipatingPlayerCount', 'SetRuleSet', 'SetStartEra', 'SetToDefaultGameName', 'SetToDefaults', 'SetToPreGame', 'SetTurnLimitType', 'SetValue', 'SetWorldBuilderEditor',
'UpdateEnabledMods']
```

判断游戏模式是否启用：

```lua
if (GameConfiguration.GetValue("GAMEMODE_APOCALYPSE") == true) then
	iDesiredVolcanoes = iDesiredVolcanoes * 2 + 2;
end
```

获取游戏难度：

```lua
iDifficulty = GameInfo.Difficulties[pPlayerConfig:GetHandicapTypeID()].Index;
```



### MapConfiguration

地图相关配置项。

```
['GetMapSize', 'GetMaxMajorPlayers', 'GetMaxMinorPlayers', 'GetMinMajorPlayers', 'GetMinMinorPlayers', 'GetScript', 'GetValue',
'SetImportFilename', 'SetMapSize', 'SetMaxMajorPlayers', 'SetMaxMinorPlayers', 'SetMinMajorPlayers', 'SetMinMinorPlayers', 'SetScript', 'SetValue']
```

#### 获取地图名称

```
MapConfiguration.GetScript()
```

真实地球会返回：`{4873eb62-8ccc-4574-b784-dda455e74e68}Maps/EarthMaps/TSLEarthStandard_XP2.Civ6Map`。



### PlayerConfigurations

`PlayerConfigurations` 本身只是个数组，通过索引来获取玩家设置。

#### 获取文明名称、描述

```lua
local pPlayerConfig = PlayerConfigurations[iPlayer];
if (pPlayerConfig ~= nil) then
    local szOwnerName = pPlayerConfig:GetCivilizationTypeName()  -- CIVILIZATION_XXX
    local szOwnerString = pPlayerConfig:GetCivilizationShortDescription()
end
```

#### 获取领袖

```lua
local p2Config = PlayerConfigurations[p2]
if (p2Config ~= nil) then
    print(p2Config:GetLeaderTypeName())    -- LEADER_MINOR_CIV_LA_VENTA
    print(p2Config:GetLeaderName())        -- LOC_CIVILIZATION_LA_VENTA_NAME
    print(p2Config:GetLeaderTypeID())      -- -432144708
end
```



### CityManager

城市管理器。

#### 让城市建造东西

```lua
local city = CityManager.GetCityAt(32, 14)
local unitEntry = GameInfo.Units["UNIT_BUILDER"]
local tParameters = {};
tParameters[CityOperationTypes.PARAM_UNIT_TYPE] = unitEntry.Hash
--tParameters[CityOperationTypes.MILITARY_FORMATION_TYPE] = MilitaryFormationTypes.CORPS_MILITARY_FORMATION;
--tParameters[CityOperationTypes.MILITARY_FORMATION_TYPE] = MilitaryFormationTypes.ARMY_MILITARY_FORMATION;
--[[ -- 判断是不是要插队
	if m_isQueueOpen or m_isManagerOpen then
		if IsBuildQueueFull(city) then
			-- Replace last itme if queue is full
			tParameters[CityOperationTypes.PARAM_INSERT_MODE] = CityOperationTypes.VALUE_REPLACE_AT;
			tParameters[CityOperationTypes.PARAM_QUEUE_DESTINATION_LOCATION] = MAX_QUEUE_SIZE;
		else
			-- Append to end of queue
			tParameters[CityOperationTypes.PARAM_INSERT_MODE] = CityOperationTypes.VALUE_APPEND;
		end
	else
		tParameters[CityOperationTypes.PARAM_INSERT_MODE] = CityOperationTypes.VALUE_REPLACE_AT;
		tParameters[CityOperationTypes.PARAM_QUEUE_DESTINATION_LOCATION] = 0;
	end
]]
CityManager.RequestOperation(city, CityOperationTypes.BUILD, tParameters);
```

对于区域、奇观，要先弹出选地的界面（最好在城市已被选中的情况下使用）：

```lua
local buildingEntry = GameInfo.Buildings['BUILDING_STONEHENGE']
local tParameters = {}
tParameters[CityOperationTypes.PARAM_BUILDING_TYPE] = buildingEntry.Hash;
tParameters[CityOperationTypes.PARAM_INSERT_MODE] = CityOperationTypes.VALUE_REPLACE_AT;
tParameters[CityOperationTypes.PARAM_QUEUE_DESTINATION_LOCATION] = 0;

UI.SetInterfaceMode(InterfaceModeTypes.BUILDING_PLACEMENT, tParameters);
```


#### 获取当前建造

```lua
local hash = pCity:GetBuildQueue():GetCurrentProductionTypeHash()
local sBuildingType = GameInfo.Buildings[hash].BuildingType
```

#### 买单位

```lua
CityManager.RequestCommand(city, CityCommandTypes.PURCHASE, tParameters);
```











### SimUnitSystem

可以让单位做出某个动作。

#### AnimationState

```lua
pUnit = UnitManager.GetUnit(playerID, unitID);
SimUnitSystem.SetAnimationState(pUnit, "RUN_COMBAT");
```

- IDLE
- DEATH
- DODGE
- IDLE_COMBAT
- REACT
- FORWARD
- BACKWARD
- RUN_START
- ATTACK
- RUN
- RUN_STOP
- RUN_COMBAT
- RUN_COMBAT_STOP
- SPAWN
- HERO
- DEFEND
- TURN_L
- TURN_R

#### Rebuild Formation

```lua
SimUnitSystem.SetVisFormation(pUnit, -1);
```

#### Rotate

```lua
local iHexHeading = SimUnitSystem.GetVisHexHeading(pUnit);
SimUnitSystem.SetVisHexHeading(pUnit, iHexHeading + 1); -- Rotate Clockwise: -1
```



### CombatManager

可以获取每场战斗的相关信息。

#### m_combatResults

```lua
m_combatResults	= CombatManager.SimulateAttackVersus( pDistrict:GetComponentID(), pDefenderUnit:GetComponentID() );

m_combatResults	= CombatManager.SimulatePriorityAttackInto( attacker, eCombatType, locX, locY );

m_combatResults	= CombatManager.SimulateAttackInto( attacker, eCombatType, locX, locY );

bCanAttack = CombatManager.CanAttackTarget(attacker:GetComponentID(), pkDefender:GetComponentID(), eCombatType);
```

其中的 `attacker` 是指 ComponentID，是一个 table：

```lua
local attacker = pDistrict:GetComponentID()
local attacker = pUnit:GetComponentID()
```

`attacker[CombatResultParameters.ID]`：

```lua
    local attackerInfo = attacker[CombatResultParameters.ID]
    local pUnit = UnitManager.GetUnit(attackerInfo.player, attackerInfo.id);
    local pDistrict:table = pPlayer:GetDistricts():FindID( attackerInfo ); -- ??
    local bIsUnit = (attackerInfo.type == ComponentType.UNIT)
```


其他用法：

```lua
local attacker = m_combatResults[CombatResultParameters.ATTACKER];
local defender = m_combatResults[CombatResultParameters.DEFENDER];

local iAttackerCombatStrength	= attacker[CombatResultParameters.COMBAT_STRENGTH];
local iDefenderCombatStrength	= defender[CombatResultParameters.COMBAT_STRENGTH];
local iAttackerBonus			= attacker[CombatResultParameters.STRENGTH_MODIFIER];
local iDefenderBonus			= defender[CombatResultParameters.STRENGTH_MODIFIER];
local iAttackerStrength = iAttackerCombatStrength + iAttackerBonus;
local iDefenderStrength = iDefenderCombatStrength + iDefenderBonus;
```

#### Component

```lua
    -- 攻击目标
    local targetObject = m_combatResults[CombatResultParameters.DEFENDER];
    if (targetObject ~= nil) then
        local defenderID = targetObject[CombatResultParameters.ID];
        if (defenderID.type == ComponentType.UNIT) then
            local pkDefender = UnitManager.GetUnit(defenderID.player, defenderID.id);
        elseif (defenderID.type == ComponentType.DISTRICT) then
            local pDefendingPlayer = Players[defenderID.player];
            local pDistrict = pDefendingPlayer:GetDistricts():FindID(defenderID.id);
        else
            local location = m_combatResults[CombatResultParameters.LOCATION];
            local pkPlot = Map.GetPlot( location.x, location.y );
        end
    end
    
    -- 截击机
    local interceptorCombatResults = m_combatResults[CombatResultParameters.INTERCEPTOR];
    local interceptorID = interceptorCombatResults[CombatResultParameters.ID];
    local pkInterceptor = UnitManager.GetUnit(interceptorID.player, interceptorID.id);
    if (pkInterceptor ~= nil) then
        m_targetData.InterceptorName			= Locale.Lookup(pkInterceptor:GetName());
        m_targetData.InterceptorCombat			= pkInterceptor:GetCombat();
        m_targetData.InterceptorDamage			= pkInterceptor:GetDamage();
        m_targetData.InterceptorMaxDamage		= pkInterceptor:GetMaxDamage();
        m_targetData.InterceptorPotentialDamage	= m_combatResults[CombatResultParameters.INTERCEPTOR][CombatResultParameters.DAMAGE_TO];
    end

    -- 防空
    local antiAirCombatResults = m_combatResults[CombatResultParameters.ANTI_AIR];
    local antiAirID = nil;
    local pkAntiAir = nil;
    if(antiAirCombatResults ~= nil) then
        antiAirID = antiAirCombatResults [CombatResultParameters.ID];
        pkAntiAir = UnitManager.GetUnit(antiAirID.player, antiAirID.id);
    end
```

ComponentType：

- ComponentType.UNIT
- ComponentType.CITY
- ComponentType.DISTRICT

#### CombatType

```lua
    local eCombatType = m_combatResults[CombatResultParameters.COMBAT_TYPE];
```

- CombatTypes.MELEE
- CombatTypes.RANGED
- CombatTypes.BOMBARD
- CombatTypes.AIR
- CombatTypes.RELIGIOUS
- CombatTypes.ICBM

#### 总结

1. 在一场战斗中，`CanAttackTarget` 判断能否攻击，`SimulateAttackInto` 或 `SimulateAttackVersus` 获取 `m_combatResults`。
2. 在 `m_combatResults` 中通过 `CombatResultParameters` 获取攻击者和防御者，他们都属于**Component**。


```lua
    --Set the numerical value
    local attackerStrength = m_combatResults[CombatResultParameters.ATTACKER][CombatResultParameters.COMBAT_STRENGTH];
    local attackerStrengthModifier = m_combatResults[CombatResultParameters.ATTACKER][CombatResultParameters.STRENGTH_MODIFIER];
    local defenderStrength = m_combatResults[CombatResultParameters.DEFENDER][CombatResultParameters.COMBAT_STRENGTH];
    local defenderStrengthModifier = m_combatResults[CombatResultParameters.DEFENDER][CombatResultParameters.STRENGTH_MODIFIER];
```



### Modding

获取模组信息。

#### 获取全部已安装的mod

```lua
local installedMods = Modding.GetInstalledMods();
local enabledModsByHandle = {};

for i,v in ipairs(installedMods) do
	enabledModsByHandle[v.Handle] = v.Enabled;
end
```

#### 判断某个mod是否启用

```lua
local a = Modding.IsModActive("4873eb62-8ccc-4574-b784-dda455e74e68");
```

---
## 待定

### AI推荐建造

```lua
-- 1. 推荐建造列表
local pTable = city:GetCityAI():GetBuildRecommendations()

-- 从推荐列表中选一个
local unknownScore = pTable[1].BuildItemScore
local buildHash = pTable[1].BuildItemHash

-- hash的用法，以项目为例
local sName = GameInfo.Projects[buildHash].Name

-- 2. 推荐改良
local recommendList:table = pCityAI:GetImprovementRecommendationsForBuilder(pSelectedUnit:GetComponentID());
```

### 疑问

```
Controls.RelationshipIcon:SetVisState(GetVisStateFromDiplomaticState(iState));
```

SetVisState 是不是说第几个

## 代码片段


### 最近城市1

```lua
local function FindNearestTargetCity( eTargetPlayer, iX, iY )

    local pCity = nullptr;
    local iShortestDistance = 10000;
    local pPlayer = Players[eTargetPlayer];
   
    local pPlayerCities:table = pPlayer:GetCities();
    for i, pLoopCity in pPlayerCities:Members() do
        local iDistance = Map.GetPlotDistance(iX, iY, pLoopCity:GetX(), pLoopCity:GetY());
        if (iDistance < iShortestDistance) then
            pCity = pLoopCity;
            iShortestDistance = iDistance;
        end
    end

    if (pCity == nullptr) then
        print ("No target city found of player " .. tostring(eTargetPlayer) .. "in attack from " .. tostring(iX) .. ", " .. tostring(iY));
    end
   
    return pCity;
end
```

### 最近城市2

```lua
function FindClosestTargetCity(iAttackingPlayer, iStartX, iStartY)

	local pCity = nullptr;
	local iShortestDistance = 10000;

	local aPlayers = PlayerManager.GetAlive();
	for loop, pPlayer in ipairs(aPlayers) do
		local iPlayer = pPlayer:GetID();
		if (iPlayer ~= iAttackingPlayer and pPlayer:GetDiplomacy():IsAtWarWith(iAttackingPlayer)) then
			local pPlayerCities:table = pPlayer:GetCities();
			for i, pLoopCity in pPlayerCities:Members() do
				local iDistance = Map.GetPlotDistance(iStartX, iStartY, pLoopCity:GetX(), pLoopCity:GetY());
				if (iDistance < iShortestDistance) then
					pCity = pLoopCity;
					iShortestDistance = iDistance;
				end
			end
		end
	end
	if (pCity == nullptr) then
		print ("No target city found for player " .. tostring(iAttackingPlayer) .. " from " .. tostring(iStartX) .. ", " .. tostring(iStartY));
	end

    return pCity;
end
```

### Unknow
https://forums.civfanatics.com/threads/adding-custom-loading-and-diplomacy-screens-for-a-civilization.609621/

- GCOInGame.lua

```lua
local initialLeaderHeadSetting = Options.GetGraphicsOption("Leaders", "Quality")

function HideLeaderHead()
    ContextPtr:LookUpControl("/InGame/DiplomacyActionView/LeaderAnchor"):SetHide(true)
end

function OnEnterGame()
    ContextPtr:LookUpControl("/InGame/DiplomacyActionView/LeaderAnchor"):RegisterWhenShown(HideLeaderHead)
    Options.SetGraphicsOption("Leaders", "Quality", 0)
    Options.ApplyGraphicsOptions()
end
Events.LoadScreenClose.Add(OnEnterGame)


function OnExitGame()
    Options.SetGraphicsOption("Leaders", "Quality", initialLeaderHeadSetting)
end
Events.LeaveGameComplete.Add(OnExitGame)
```

- GCOInGame.modinfo

```xml
 <Components>
        <ImportFiles id="YOUR_IMPORTED_FILES">
            <Items>
                <File>dom_blank.dds</File>
            </Items>
        </ImportFiles>
        <UserInterface>   
            <Properties>
                <Context>InGame</Context>
            </Properties>
            <Items>
                <File>GCOInGame.xml</File>
            </Items>
        </UserInterface>
    </Components>
 
    <Files>
        <File>GCOInGame.lua</File>
        <File>GCOInGame.xml</File>
        <File>dom_blank.dds</File>
    </Files>
```


### Remove button from Action

https://forums.civfanatics.com/threads/remove-button-from-action.644509/

```lua
function DetachHurryButtonToUnitPanelActions()
	local actionsStack = ContextPtr:LookUpControl("/InGame/UnitPanel/SecondaryActionsStack");

	if actionsStack ~= nil then
		actionsStack:DestroyChild(Controls.HurryProductionActionsStack);
	end
end
```

---




## 疑问

### 鼠标点击格位的功能

#### InterfaceModeMessageHandler

在 WorldInput_Expansion2.lua 中添加跳跃的操作，这到底是个什么东西？





## 附录

### Keys

注：前面十个数字的访问方式，如 8: `Keys['8']`。其余属性，如 VK_ADD: `Keys.VK_ADD`。

- 0
- 1
- 2
- 3
- 4
- 5
- 6
- 7
- 8
- 9
- A
- B
- C
- D
- E
- F
- G
- H
- I
- J
- K
- L
- M
- N
- O
- P
- Q
- R
- S
- T
- U
- V
- W
- X
- Y
- Z
- VK_ACCEPT
- VK_ADD
- VK_ALT
- VK_APPS
- VK_ATTN
- VK_BACK
- VK_BROWSER_BACK
- VK_BROWSER_FAVORITES
- VK_BROWSER_FORWARD
- VK_BROWSER_HOME
- VK_BROWSER_REFRESH
- VK_BROWSER_SEARCH
- VK_BROWSER_STOP
- VK_CAPITAL
- VK_CONTROL
- VK_CONVERT
- VK_CRSEL
- VK_DECIMAL
- VK_DELETE
- VK_DIVIDE
- VK_DOWN
- VK_END
- VK_EREOF
- VK_ESCAPE
- VK_EXSEL
- VK_F1
- VK_F10
- VK_F11
- VK_F12
- VK_F13
- VK_F14
- VK_F15
- VK_F16
- VK_F17
- VK_F18
- VK_F19
- VK_F2
- VK_F20
- VK_F21
- VK_F22
- VK_F23
- VK_F24
- VK_F3
- VK_F4
- VK_F5
- VK_F6
- VK_F7
- VK_F8
- VK_F9
- VK_FINAL
- VK_HANGEUL
- VK_HANGUL
- VK_HANJA
- VK_HOME
- VK_ICO_00
- VK_ICO_CLEAR
- VK_ICO_HELP
- VK_INSERT
- VK_JUNJA
- VK_KANA
- VK_KANJI
- VK_LAUNCH_APP1
- VK_LAUNCH_APP2
- VK_LAUNCH_MAIL
- VK_LAUNCH_MEDIA_SELECT
- VK_LCONTROL
- VK_LEFT
- VK_LMENU
- VK_LSHIFT
- VK_LWIN
- VK_MEDIA_NEXT_TRACK
- VK_MEDIA_PLAY_PAUSE
- VK_MEDIA_PREV_TRACK
- VK_MEDIA_STOP
- VK_MENU
- VK_MODECHANGE
- VK_MULTIPLY
- VK_NEXT
- VK_NONAME
- VK_NONCONVERT
- VK_NUMLOCK
- VK_NUMPAD0
- VK_NUMPAD1
- VK_NUMPAD2
- VK_NUMPAD3
- VK_NUMPAD4
- VK_NUMPAD5
- VK_NUMPAD6
- VK_NUMPAD7
- VK_NUMPAD8
- VK_NUMPAD9
- VK_OEM_1
- VK_OEM_102
- VK_OEM_2
- VK_OEM_3
- VK_OEM_4
- VK_OEM_5
- VK_OEM_6
- VK_OEM_7
- VK_OEM_8
- VK_OEM_ATTN
- VK_OEM_AUTO
- VK_OEM_AX
- VK_OEM_BACKTAB
- VK_OEM_CLEAR
- VK_OEM_COMMA
- VK_OEM_COPY
- VK_OEM_CUSEL
- VK_OEM_ENLW
- VK_OEM_FINISH
- VK_OEM_FJ_JISHO
- VK_OEM_FJ_LOYA
- VK_OEM_FJ_MASSHOU
- VK_OEM_FJ_ROYA
- VK_OEM_FJ_TOUROKU
- VK_OEM_JUMP
- VK_OEM_MINUS
- VK_OEM_NEC_EQUAL
- VK_OEM_PA1
- VK_OEM_PA2
- VK_OEM_PA3
- VK_OEM_PERIOD
- VK_OEM_PLUS
- VK_OEM_RESET
- VK_OEM_WSCTRL
- VK_PA1
- VK_PACKET
- VK_PAUSE
- VK_PLAY
- VK_PRIOR
- VK_PROCESSKEY
- VK_RCONTROL
- VK_RETURN
- VK_RIGHT
- VK_RMENU
- VK_RSHIFT
- VK_RWIN
- VK_SCROLL
- VK_SEPARATOR
- VK_SHIFT
- VK_SLEEP
- VK_SNAPSHOT
- VK_SPACE
- VK_SUBTRACT
- VK_TAB
- VK_UP
- VK_VOLUME_DOWN
- VK_VOLUME_MUTE
- VK_VOLUME_UP
- VK_ZOOM


### MouseEvents

- MouseEvents.LButtonDown
- MouseEvents.LButtonDoubleClick
- MouseEvents.LButtonUp
- MouseEvents.MButtonDown
- MouseEvents.MButtonDoubleClick
- MouseEvents.MButtonUp
- MouseEvents.PointerDown
- MouseEvents.PointerUp
- MouseEvents.RButtonDown
- MouseEvents.RButtonDoubleClick
- MouseEvents.RButtonUp

### CombatResultParameters

- ALT_SOURCE_LOCATION
- ANTI_AIR
- ATTACKER
- ATTACKER_ADVANCED_DURING_VISUALIZATION
- ATTACKER_ADVANCES
- COMBAT_STRENGTH
- COMBAT_SUB_TYPE
- COMBAT_TYPE
- DAMAGE_FROM
- DAMAGE_MEMBERS
- DAMAGE_MEMBER_COUNT
- DAMAGE_TO
- DEFENDER
- DEFENDER_CAPTURED
- DEFENDER_RETALIATES
- DEFENSE_DAMAGE_TO
- ERA
- EXPERIENCE_CHANGE
- FINAL_DAMAGE_TO
- FINAL_DEFENSE_DAMAGE_TO
- ID
- INTERCEPTOR
- LOCATION
- LOCATION_PILLAGED
- MAX_DEFENSE_HIT_POINTS
- MAX_HIT_POINTS
- PREVIEW_TEXT_ANTI_AIR
- PREVIEW_TEXT_ASSIST
- PREVIEW_TEXT_DEFENSES
- PREVIEW_TEXT_HEALTH
- PREVIEW_TEXT_INTERCEPTOR
- PREVIEW_TEXT_MODIFIER
- PREVIEW_TEXT_OPPONENT
- PREVIEW_TEXT_PROMOTION
- PREVIEW_TEXT_RESOURCES
- PREVIEW_TEXT_TERRAIN
- STRENGTH_MODIFIER
- VISUALIZE
- WMD_STATUS
- WMD_STRIKE_RANGE
- WMD_TYPE

### InterfaceModeTypes

- NONE
- TELEPORT_TO_CITY
- PRIORITY_TARGET
- MAKE_TRADE_ROUTE
- COASTAL_RAID
- AIR_ATTACK
- CITY_RANGE_ATTACK
- ROUTE_TO
- SELECTION
- REBASE
- ICBM_STRIKE
- CITY_MANAGEMENT
- DEPLOY
- DISTRICT_PLACEMENT
- WB_SELECT_PLOT
- FORM_CORPS
- MOVE_JUMP
- CITY_SELECTION
- FORM_ARMY
- DISEMBARK
- EMBARK
- SPY_CHOOSE_MISSION
- BUILD_IMPROVEMENT_ADJACENT
- ATTACK
- NATURAL_WONDER
- AIRLIFT
- SPY_TRAVEL_TO_CITY
- BUILDING_PLACEMENT
- VIEW_MODAL_LENS
- MOVE_TO
- CINEMATIC
- PLACE_MAP_PIN
- DISTRICT_RANGE_ATTACK
- WMD_STRIKE
- CITY_PLOT_SELECTION
- DEBUG
- RANGE_ATTACK
- FULLSCREEN_MAP
- PARADROP


### UnitOperationTypes

- AIR_ATTACK
- BUILD_CAMPUS
- BUILD_ENCAMPMENT
- BUILD_ENTERTAINMENT_COMPLEX
- BUILD_HARBOR
- BUILD_HOLY_SITE
- BUILD_IMPROVEMENT
- BUILD_IMPROVEMENT_ADJACENT
- BUILD_ROUTE
- BUILD_THEATER_DISTRICT
- CLEAR_CONTAMINATION
- COASTAL_RAID
- DEPLOY
- DISEMBARK
- EMBARK
- EXECUTE_SCRIPT
- FORTIFY
- FOUND_CITY
- HARVEST_RESOURCE
- MAKE_TRADE_ROUTE
- MOVE_TO
- MOVE_TO_UNIT
- PARAM_CITY0_ID
- PARAM_CITY0_PLAYER
- PARAM_CITY1_ID
- PARAM_CITY1_PLAYER
- PARAM_CITY_ID
- PARAM_CITY_PLAYER
- PARAM_DIRECTIVE
- PARAM_FLAGS
- PARAM_IMPROVEMENT0_TYPE
- PARAM_IMPROVEMENT_TYPE
- PARAM_MODIFIERS
- PARAM_OPERATION_TYPE
- PARAM_PROMOTION0_TYPE
- PARAM_RESOURCE0_TYPE
- PARAM_RESOURCE_TYPE
- PARAM_SOURCE_LOCATION
- PARAM_TARGET_LOCATION
- PARAM_TURN
- PARAM_UNIT0_ID
- PARAM_UNIT0_PLAYER
- PARAM_UNIT1_ID
- PARAM_UNIT1_PLAYER
- PARAM_UNIT_ID
- PARAM_UNIT_PLAYER
- PARAM_WMD0_TYPE
- PARAM_WMD_TYPE
- PARAM_X
- PARAM_X0
- PARAM_X1
- PARAM_Y
- PARAM_Y0
- PARAM_Y1
- PILLAGE
- RANGE_ATTACK
- REBASE
- REMOVE_FEATURE
- REMOVE_IMPROVEMENT
- REPAIR
- RETRAIN
- ROUTE_TO
- SPY_COUNTERSPY
- SPY_DISRUPT_ROCKETRY
- SPY_FABRICATE_SCANDAL
- SPY_FOMENT_UNREST
- SPY_GAIN_SOURCES
- SPY_GREAT_WORK_HEIST
- SPY_LISTENING_POST
- SPY_NEUTRALIZE_GOVERNOR
- SPY_RECRUIT_PARTISANS
- SPY_SABOTAGE_PRODUCTION
- SPY_SIPHON_FUNDS
- SPY_STEAL_TECH_BOOST
- SPY_TRAVEL_NEW_CITY
- SWAP_UNITS
- TELEPORT_TO_CITY
- TYPE
- UPGRADE
- WAIT_FOR
- WMD_STRIKE

### UnitCommandTypes 

- AIRLIFT
- AUTOMATE
- CANCEL
- CONDEMN_HERETIC
- DELETE
- DISTRICT_PRODUCTION
- ENTER_FORMATION
- EXECUTE_SCRIPT
- EXIT_FORMATION
- FORM_ARMY
- FORM_CORPS
- GIFT
- MOVE_JUMP
- NAME_UNIT
- PARADROP
- PARAM_CITY_ID
- PARAM_CITY_PLAYER
- PARAM_NAME
- PARAM_PROMOTION_TYPE
- PARAM_UNIT_ID
- PARAM_UNIT_PLAYER
- PARAM_X
- PARAM_Y
- PLUNDER_TRADE_ROUTE
- PRIORITY_TARGET
- PROJECT_PRODUCTION
- PROMOTE
- STOP_AUTOMATION
- TYPE
- UPGRADE
- WAKE
- WONDER_PRODUCTION


### CityOperationTypes

- BUILD
- MILITARY_FORMATION_TYPE
- PARAM_BUILDING_TYPE
- PARAM_CITY0_ID
- PARAM_CITY0_PLAYER
- PARAM_CITY1_ID
- PARAM_CITY1_PLAYER
- PARAM_DISTRICT_TYPE
- PARAM_FLAGS
- PARAM_INSERT_MODE
- PARAM_MODIFIERS
- PARAM_PRODUCTION_TYPE
- PARAM_PROJECT_TYPE
- PARAM_QUEUE_DESTINATION_LOCATION
- PARAM_QUEUE_LOCATION
- PARAM_QUEUE_SOURCE_LOCATION
- PARAM_UNIT0_ID
- PARAM_UNIT0_PLAYER
- PARAM_UNIT1_ID
- PARAM_UNIT1_PLAYER
- PARAM_UNIT_ID
- PARAM_UNIT_PLAYER
- PARAM_UNIT_TYPE
- PARAM_X
- PARAM_X0
- PARAM_X1
- PARAM_Y
- PARAM_Y0
- PARAM_Y1
- VALUE_APPEND
- VALUE_CLEAR
- VALUE_EXCLUSIVE
- VALUE_INSERT_AT
- VALUE_MOVE_TO
- VALUE_POP_BACK
- VALUE_POP_FRONT
- VALUE_PREPEND
- VALUE_REMOVE_AT
- VALUE_REPLACE_AT
- VALUE_SWAP












## 结尾

未完待续。