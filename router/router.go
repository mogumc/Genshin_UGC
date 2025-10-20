// 网关路由初始化与注册
// @author MoGuQAQ
// @version 1.0.0

package router

import (
	"genshin/api"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	GinMode := "release"
	gin.SetMode(GinMode)
	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())
	Register(router)
	return router
}

func Register(router *gin.Engine) {
	router.NoRoute(func(c *gin.Context) {
		c.Data(http.StatusOK, "application/json; charset=utf-8", []byte("404 Not Found"))
	})
	router.GET("/ugc-tutorial/:dataset/sea/:lang/:file", api.Catlog)
	router.GET("/ugc-tutorial/:dataset/sea/:lang/:file/content.html", api.Content)
	router.GET("/", func(c *gin.Context) {
		c.File("./dist/index.html")
	})
	router.Static("/dist", "./dist")
}
