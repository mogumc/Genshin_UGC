package api

import (
	"fmt"
	"genshin/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

const BaseURL = "https://act-webstatic.mihoyo.com/ugc-tutorial"

// 海外地区 https://act-webstatic.hoyoverse.com/ugc-tutorial

const BaseRe = "cn"

// 海外地区 sea

func Catlog(c *gin.Context) {
	dataset := c.Param("dataset")
	lang := c.Param("lang")
	file := c.Param("file")
	if dataset != "knowledge" && dataset != "course" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid dataset"})
		return
	}
	remoteURL := BaseURL + "/" + dataset + "/" + BaseRe + "/" + lang + "/" + file
	fmt.Printf("访问网站 %s", remoteURL)
	content := utils.Get(remoteURL)
	if content == "" {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "resource not found or failed to load from upstream",
		})
		return
	}
	c.Data(http.StatusOK, "application/json; charset=utf-8", []byte(content))
}
