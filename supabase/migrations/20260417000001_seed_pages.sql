-- Seed initial pages
INSERT INTO pages (title, slug, content, excerpt, is_published) VALUES
(
  'Privacy Policy',
  'privacy-policy',
  '{
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 1 },
        "content": [{ "type": "text", "text": "Privacy Policy" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Last updated: " }]
      },
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "This Privacy Policy describes how DubaiPropertyIQ collects, uses, and protects your information."
          }
        ]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "1. Information We Collect" }]
      },
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "We collect information you provide directly, including name, email, and phone number when you inquire about properties."
          }
        ]
      }
    ]
  }'::jsonb,
  'Learn how DubaiPropertyIQ protects your privacy and handles your data.',
  true
),
(
  'Terms & Conditions',
  'terms-conditions',
  '{
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 1 },
        "content": [{ "type": "text", "text": "Terms & Conditions" }]
      },
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Welcome to DubaiPropertyIQ. By using our platform, you agree to these terms."
          }
        ]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "1. Acceptance of Terms" }]
      }
    ]
  }'::jsonb,
  'Terms and conditions for using DubaiPropertyIQ services.',
  true
),
(
  'Cookie Policy',
  'cookie-policy',
  '{
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 1 },
        "content": [{ "type": "text", "text": "Cookie Policy" }]
      },
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "This Cookie Policy explains how DubaiPropertyIQ uses cookies and similar technologies."
          }
        ]
      }
    ]
  }'::jsonb,
  'Information about cookies on DubaiPropertyIQ.',
  true
)
ON CONFLICT (slug) DO NOTHING;
