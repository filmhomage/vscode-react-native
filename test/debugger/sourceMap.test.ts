// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.

import {SourceMapUtil, IStrictUrl} from "../../src/debugger/sourceMap";

import * as assert from "assert";
import * as path from "path";
import * as url from "url";

suite("sourceMap", function() {
    suite("debuggerContext", function() {
        test("should convert host filesystem paths to URL-style-paths", function() {
            const sourceMap = new SourceMapUtil();
            const filePath = path.join("foo", "bar", "baz");
            const urlPath = "foo/bar/baz";
            const result = (<any>sourceMap).makeUnixStylePath(filePath);
            assert(result === urlPath, `Expected "${urlPath}", found "${result}"`);
        });

        test("should resolve a valid sourcemap url", function () {
            const scriptUrl: url.Url = url.parse("http://localhost:8081/index.ios.bundle?platform=ios&dev=true");
            const scriptBody = "//# sourceMappingURL=/index.ios.map?platform=ios&dev=true";
            const expectedUrlHref = "http://localhost:8081/index.ios.map?platform=ios&dev=true";

            const sourceMap = new SourceMapUtil();
            const result = sourceMap.getSourceMapURL(scriptUrl, scriptBody);
            assert.equal(expectedUrlHref, result && result.href);
        });

        test("should ignore inline sourcemap urls", function () {
            const scriptUrl: url.Url = url.parse("http://localhost:8081/index.ios.bundle?platform=ios&dev=true");
            const scriptBody = "//# sourceMappingURL=data:application/json;base64,eyJmb28iOiJiYXIifQ==\n" +
                               "//# sourceMappingURL=/index.ios.map?platform=ios&dev=true";
            const expectedUrlHref = "http://localhost:8081/index.ios.map?platform=ios&dev=true";

            const sourceMap = new SourceMapUtil();
            const result = sourceMap.getSourceMapURL(scriptUrl, scriptBody);
            assert.equal(expectedUrlHref, result && result.href);
        });

        test("should return default IStrictUrl for an invalid sourcemap url", function () {
            const scriptUrl: url.Url = url.parse("http://localhost:8081/index.ios.bundle?platform=ios&dev=true");
            const scriptBody = "";

            const sourceMap = new SourceMapUtil();
            const result = sourceMap.getSourceMapURL(scriptUrl, scriptBody);
            assert.deepEqual(null, result);
        });

        test("should return default IStrictUrl if there are only inline sourcemap urls", function () {
            const scriptUrl: url.Url = url.parse("http://localhost:8081/index.ios.bundle?platform=ios&dev=true");
            const scriptBody = "//# sourceMappingURL=data:application/json;base64,eyJmb28iOiJiYXIifQ==\n" +
                               "//# sourceMappingURL=data:application/json;base64,eyJiYXoiOiJxdXV4In0=";

            const sourceMap = new SourceMapUtil();
            const result = sourceMap.getSourceMapURL(scriptUrl, scriptBody);
            assert.deepEqual(null, result);
        });

        test("should update the contents of a source map file", function() {
            const sourceMapBody: string = JSON.stringify({"version": 3, "sources": ["test/index.ts"], "names": [], "mappings": "", "file": "test/index.js", "sourceRoot": "../../src"});
            const scriptPath: string = "test/newIndex.ts";
            const sourcesRootPath: string = "new/src";
            const expectedSourceMapBody: string = JSON.stringify({"version": 3, "sources": ["../../test/index.ts"], "names": [], "mappings": "", "file": scriptPath, "sourceRoot": ""});
            const sourceMap = new SourceMapUtil();

            const result: string = sourceMap.updateSourceMapFile(sourceMapBody, scriptPath, sourcesRootPath);
            assert.equal(expectedSourceMapBody, result);
        });

        test("should update source map file path for remote packager", function () {
            const localRoot = "/home/local";
            const remoteRoot = "/home/remote";
            const sourceMapBody: string = JSON.stringify({ "version": 3, "sources": [`${remoteRoot}/test/index.ts`], "names": [], "mappings": "", "file": "test/index.js", "sourceRoot": "../../src" });
            const scriptPath: string = "test/newIndex.ts";
            const sourcesRootPath: string = `${localRoot}/new/src`;
            const expectedSourceMapBody: string = JSON.stringify({ "version": 3, "sources": [`../../test/index.ts`], "names": [], "mappings": "", "file": scriptPath, "sourceRoot": "" });
            const sourceMap = new SourceMapUtil();

            const result: string = sourceMap.updateSourceMapFile(sourceMapBody, scriptPath, sourcesRootPath, remoteRoot, localRoot);
            assert.equal(expectedSourceMapBody, result);
        });

        test("should update scripts with source mapping urls", function() {
            const scriptBody: string = "//# sourceMappingURL=/index.ios.map?platform=ios&dev=true";
            const sourceMappingUrl: IStrictUrl = <IStrictUrl>url.parse("/index.android.map");
            const expectedScriptBody = "//# sourceMappingURL=index.android.map";
            const sourceMap = new SourceMapUtil();

            const result = sourceMap.updateScriptPaths(scriptBody, sourceMappingUrl);
            assert.equal(expectedScriptBody, result);
        });

        test("should not update scripts without source mapping urls", function() {
            const scriptBody: string = "var path = require('path');";
            const sourceMappingUrl: IStrictUrl = <IStrictUrl>url.parse("/index.android.map");
            const sourceMap = new SourceMapUtil();

            const result = sourceMap.updateScriptPaths(scriptBody, sourceMappingUrl);
            assert.equal(scriptBody, result);
        });

        test("should update absolute source path to relative unix style path", function() {
            const sourcePath: string = "foo/bar";
            const sourcesRootPath: string = "baz/fuzz";
            const expectedPath: string = "../../foo/bar";
            const sourceMap = new SourceMapUtil();

            const result = (<any>sourceMap).updateSourceMapPath(sourcePath, sourcesRootPath);
            assert.equal(expectedPath, result);
        });
    });
});
