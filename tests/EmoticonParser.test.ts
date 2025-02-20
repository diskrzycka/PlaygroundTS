import { EmoticonParser } from "../src/EmoticonParser";

test('EmoticonParser.parseText', () => {
    const parser = new EmoticonParser();
    expect(parser.parseText("Hello, world!")).toBe("Hello, world!");
    expect(parser.parseText("Hello, :) world!")).toBe("Hello, 😺 world!")
    expect(parser.parseText("Hello, :-D world! ;*")).toBe("Hello, 😸 world! 😽");
    expect(parser.parseText("Hello, :-D world! ;*;-*:*")).toBe("Hello, 😸 world! 😽😽😽");
});