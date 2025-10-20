package api

import (
	"genshin/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Content(c *gin.Context) {
	dataset := c.Param("dataset")
	lang := c.Param("lang")
	file := c.Param("file")
	if dataset != "knowledge" && dataset != "course" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid dataset"})
		return
	}
	remoteURL := BaseURL + "/" + dataset + "/sea/" + lang + "/" + file + "/content.html"
	content := utils.Get(remoteURL)
	if content == "" {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "resource not found or failed to load from upstream",
		})
		return
	}
	c.Data(http.StatusOK, "text/html; charset=utf-8", []byte(content))
}
