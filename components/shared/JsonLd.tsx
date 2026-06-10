import Script from 'next/script';
import type { Graph, Thing, WithContext } from 'schema-dts';

export type SchemaJsonLd = WithContext<Thing> | Graph;

type JsonLdProps = {
  id: string;
  data: SchemaJsonLd | SchemaJsonLd[];
};

function serializeJsonLd(data: JsonLdProps['data']) {
  return JSON.stringify(data).replace(/</g, '\\u003C').replace(/>/g, '\\u003E').replace(/&/g, '\\u0026').replace(/'/g, '\\u0027');
}

export function JsonLd({ id, data }: JsonLdProps) {
  return <Script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
