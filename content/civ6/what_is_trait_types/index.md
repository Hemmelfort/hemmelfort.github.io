---
title: 一文搞懂《文明6》中的TraitType
author: Hemmelfort
isCJKLanguage: true
draft: false
date: 2019-12-09T11:26:27+08:00
lastmod: 2024-04-16T19:27:04+08:00
---
**Trait**：特性，特色。指的是某个文明专属的东西，包括各文明专属的单位、改良、建筑、区域、能力、议程等等。

以单位为例，弓箭手没有 TraitType，所以谁都可以造；战象有一个属于印度的 TraitType，所以只有印度能造。

<!--more-->

## TraitType 的定义

以印度战象为例：

### 1. 定义一个 Trait

在《文明6》中，任意一种类型 Type （比如单位、建筑、议程、胜利方式等等，都要先在 Types 表中定义。

在下方代码中，前面的 `TRAIT_CIVILIZATION_UNIT_INDIAN_VARU` 自己起名，记住这个名字，等下还要多次使用。

后面的 `KIND_TRAIT` 不能动，表示这是一个 Trait 类型。

```xml
<Types>
    <Row Type="TRAIT_CIVILIZATION_UNIT_INDIAN_VARU" 
         Kind="KIND_TRAIT"/>
</Types>
```

这样就完成了一个 Trait 的初步定义。


### 2. 设置显示的文本

刚才定义了一个 Trait，这一步是给它设置显示给玩家看的文本。

```xml
<Traits>
    <Row TraitType="TRAIT_CIVILIZATION_UNIT_INDIAN_VARU" 
         Name="专属单位：战象"
         Description="这是一个专属的近战单位。"/>
</Traits>
```

其中描述（Description）可以不写。

注意：这里只有文本的编写，还没有真正绑定到具体的单位。


### 3. 这个Trait属于谁

这一步用于把这个 Trait 与文明相绑定。其中 `CIVILIZATION_INDIA` 是印度文明。

```xml
<CivilizationTraits>
    <Row CivilizationType="CIVILIZATION_INDIA" 
         TraitType="TRAIT_CIVILIZATION_UNIT_INDIAN_VARU"/>
</CivilizationTraits>
```

或者与领袖绑定，其中 `LEADER_GANDHI` 是领袖甘地。

**注意：** 要么与文明绑定，要么与领袖绑定，只能二选一。

```xml
<LeaderTraits>
    <Row LeaderType="LEADER_GANDHI" 
         TraitType="TRAIT_CIVILIZATION_UNIT_INDIAN_VARU"/>
</LeaderTraits>
```

## TraitType 的使用

上面创建的战象 Trait 只是一个空壳，需要绑定到真正的战象单位上才生效。

在定义单位的 Units 表中可以插入 TraitType:

```xml
<Units>
    <Row
        UnitType="UNIT_INDIAN_VARU"
        TraitType="TRAIT_CIVILIZATION_UNIT_INDIAN_VARU"
   
         (单位的其他内容)
         />
</Units>
```

同样的道理，改良设施是在 Improvements 表中加入 TraitType，建筑在 Buildings 表中，区域在 Districts 表中，等等。


---



## TraitType 使用修改器 Modifier（非必需）

Trait 可以是单位，也可以是某项特殊技能，只需让它在 TraitModifiers 表中绑定一个 ModifierId（详见修改器的章节）。

例如秦始皇的 TraitType “第一帝王”（`FIRST_EMPEROR_TRAIT`）消耗工人加速奇观修建进程：

```xml
<TraitModifiers>
    <Row TraitType="FIRST_EMPEROR_TRAIT" 
         ModifierId="TRAIT_BUILDER_WONDER_PERCENT"/>
</TraitModifiers>
```

或者用sql语言：

```sql
insert into TraitModifiers (TraitType, ModifierId) values
("FIRST_EMPEROR_TRAIT", "TRAIT_BUILDER_WONDER_PERCENT");
```
