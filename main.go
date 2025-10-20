// 启动文件
// @author MoGuQAQ
// @version 1.0.0

package main

import (
	"fmt"
	"genshin/router"
)

func main() {
	fmt.Println("初始化路由")
	router := router.InitRouter()
	address := "127.0.0.1:1088"
	fmt.Printf("网关启动成功 运行在: %s\n", address)
	router.Run(address)
}
