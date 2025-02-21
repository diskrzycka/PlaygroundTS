import { EmoticonParser } from "./EmoticonParser";

const parser = new EmoticonParser();
console.log(parser.parseText("Hello, :) world! :)"));
console.log(parser.parseText("Hello, :-D world! ;*;-*:*"));

