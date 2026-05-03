+++
date = '2026-05-03'
draft = false
title = '用 Surge 代理 APNS：恢复大陆地区 Apple 推送'
tags = ['网络']
+++

前些天，大陆地区不少苹果用户发现 Telegram 收不到推送了。原因是 Apple 的推送通道（APNS）在国内被干扰，消息送不到设备上。

解决思路其实很直接：把 APNS 流量交给代理转发。下面以 Surge 为例，记录一下我自己的配置过程。

## 一、添加 APNS 规则集

在 Surge 配置里加上这条规则集，并将它指向你常用的代理策略：

```
https://raw.githubusercontent.com/QuixoticHeart/rule-set/refs/heads/ruleset/surge/apns.list
```

它收录了 APNS 相关的域名与 IP 段，命中后由代理转发。

## 二、打开 Include APNS

蜂窝网络下，iOS 默认不会让 VPN 接管 APNS 流量，必须在 Surge 里手动打开这个开关：

> Home → General → More Settings → Advanced Settings → Include APNS

## 三、用 fallback 给代理兜底

到这里，Telegram 的推送应该已经回来了。但还留着一个隐患：一旦代理节点出故障，APNS 流量也会跟着断——**国内应用**的推送会一并失联，这显然不是我们想要的结果。

所以强烈建议给 APNS 配置 fallback 策略：代理优先，DIRECT 兜底。

```
APNS = fallback, 你的代理节点, DIRECT
```

代理可用时走代理，代理失效时自动回到直连。最坏的情况，也只是回到没配置之前的状态，不至于把国内的推送一起搭进去。
