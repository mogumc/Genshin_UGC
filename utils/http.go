package utils

import (
	"bytes"
	"crypto/tls"
	"io"
	"log"
	"net/http"
	"time"
)

var client = &http.Client{
	CheckRedirect: func(req *http.Request, via []*http.Request) error {
		return http.ErrUseLastResponse
	},
	Timeout: 15 * time.Second,
	Transport: &http.Transport{
		TLSClientConfig: &tls.Config{
			InsecureSkipVerify: true,
		},
	},
}

func Get(url string) string {
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("User-Agent", "Mozilla")
	resp, err := client.Do(req)
	body := new(bytes.Buffer)
	if err != nil {
		log.Println(err)
	} else {
		defer resp.Body.Close()
		io.Copy(body, resp.Body)
	}
	result := body.String()
	return result
}
