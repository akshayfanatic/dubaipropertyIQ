export type JsonLdValue = string | number | boolean | null | JsonLdObject | JsonLdValue[];

export type JsonLdObject = {
  [key: string]: JsonLdValue;
};

type JsonLdProps = {
  id: string;
  data: JsonLdObject | JsonLdObject[];
};

function serializeJsonLd(data: JsonLdProps['data']) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function JsonLd({ id, data }: JsonLdProps) {
  return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
