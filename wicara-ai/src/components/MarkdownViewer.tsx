import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography } from 'antd';

interface MarkdownViewerProps {
    content: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
    return (
        <Typography>
            <ReactMarkdown
                components={{
                    h1: ({ node, ...props }) => <Typography.Title level={1} {...props} />,
                    h2: ({ node, ...props }) => <Typography.Title level={2} {...props} />,
                    h3: ({ node, ...props }) => <Typography.Title level={3} {...props} />,
                    ul: ({ node, ...props }) => <ul style={{ paddingLeft: 20 }} {...props} />,
                    li: ({ node, ...props }) => <li style={{ marginBottom: 5 }} {...props} />,
                    p: ({ node, ...props }) => <Typography.Paragraph {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </Typography>
    );
};
