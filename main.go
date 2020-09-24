package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"sync"

	rice "github.com/GeertJohan/go.rice"
	"github.com/golang/glog"
	"github.com/liuzl/fmr"
	"github.com/liuzl/goutil/rest"
	"github.com/robertkrimen/otto"
)

var (
	addr    = flag.String("addr", ":8080", "bind address")
	grammar = flag.String("g", "grammars/math.grammar", "grammar file")
	start   = flag.String("start", "number", "start rule")
	js      = flag.String("js", "date.js", "javascript file")
)

var (
	g     *fmr.Grammar
	onceG sync.Once
)

func G() *fmr.Grammar {
	onceG.Do(func() {
		var err error
		g, err = fmr.GrammarFromFile(*grammar)
		if err != nil {
			panic(err)
		}
	})
	return g
}

func errMsg(w http.ResponseWriter, err string) {
	rest.MustEncode(w, struct {
		Status  string `json:"status"`
		Message string `json:"message"`
	}{Status: "error", Message: err})
}

func Handler(w http.ResponseWriter, r *http.Request) {
	glog.Infof("addr=%s  method=%s host=%s uri=%s",
		r.RemoteAddr, r.Method, r.Host, r.RequestURI)
	r.ParseForm()
	text := strings.TrimSpace(r.FormValue("text"))
	if text == "" {
		errMsg(w, "text is empty")
		return
	}

	s := strings.Split(*start, ",")

	trees, err := G().ExtractMaxAll(text, s...)
	if err != nil {
		errMsg(w, err.Error())
		return
	}
	script, err := ioutil.ReadFile(*js)
	if err != nil {
		glog.Fatal(err)
	}
	vm := otto.New()
	if _, err = vm.Run(script); err != nil {
		glog.Fatal(err)
	}
	var results []map[string]interface{}
	for _, tree := range trees {
		m := tree.Tree()
		sem, err := tree.Semantic()
		if err != nil {
			glog.Fatal(err)
		}
		fmt.Print(sem)
		value, err := vm.Run(sem)
		if err != nil {
			glog.Error(sem, err)
			continue
		}
		m["bracketd"] = tree.Bracketed()

		rs, _ := value.Export()
		m["value"] = rs
		results = append(results, m)
	}
	rest.MustEncode(w, results)
}

func main() {
	flag.Parse()
	defer glog.Flush()
	G()
	defer glog.Info("server exit")
	http.Handle("/api/", rest.WithLog(Handler))
	http.Handle("/", http.FileServer(rice.MustFindBox("ui").HTTPBox()))
	glog.Info("server listen on", *addr)
	glog.Error(http.ListenAndServe(*addr, nil))
}
