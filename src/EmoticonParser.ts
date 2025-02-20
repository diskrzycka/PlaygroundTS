export class EmoticonParser {
    parseText(text: string): string {
        const emoticons: { [key: string]: string } =
        {
            ":)": "😺",
            ":-)": "😺",
            ";)": "😺",
            ";-)": "😺",
            ":(": "😿",
            ":-(": "😿",
            ";(": "😿",
            ";-(": "😿",
            ":D": "😸",
            ":-D": "😸",
            ":o": "🙀",
            ":O": "🙀",
            ":-o": "🙀",
            ":-O": "🙀",
            ":*": "😽",
            ":-*": "😽",
            ";*": "😽",
            ";-*": "😽",
        };

        for (const key in emoticons) {
            text = text.replace(key, emoticons[key]);
        }
        return text;
    }
}