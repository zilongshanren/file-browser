作业:

请制作一份名为 file-browser 的 package, 该 package 通过 panel 浏览本地文件, 通过 core-level watch 本地文件的改动并通过 ipc 和 panel 进行通信

要求:

通过自己指定的目录夹地址浏览其中的文件.
panel 中要能够正确展现文件的树形结构.
通过 node 的 Fs.watch 模块 或者 https://github.com/paulmillr/chokidar 检测文件改变, 并将改变信息如 ( rename, move, delete, new ) 正确展现到 panel 中.
在 panel 中选择某个文件, 按下 delete 按键能够正确删除该文件.
所有 IO 操作都必须放在 core-level 完成.
注意:

请用自己的 github 账号创建一份 file-browser 的 repo, 并用这份 repo 作为 package
请将自己的 repo 地址贴出, 我会为大家 review 完成情况.
