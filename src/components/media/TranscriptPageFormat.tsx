interface TranscriptPageFormatProps {
    content: string;
}

export const TranscriptPageFormat = ({ content }: TranscriptPageFormatProps): string => {
    return `<html>
    <head>
        <title>Episode Transcript</title>
        <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .transcript {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            white-space: pre-wrap;
        }
        .speaker {
            font-weight: bold;
            color: #2e008b;
            display: block;
            margin-top: 1em;
        }
        </style>
    </head>
        <body>
            <div class="transcript">
            ${content}
            </div>
        </body>
    </html>
    `;
};
