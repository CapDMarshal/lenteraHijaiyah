"use client";

/* global JSX type extension so TypeScript accepts <ion-icon> */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { name: string; size?: string },
        HTMLElement
      >;
    }
  }
}

export function IonIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return <ion-icon name={name} class={className} />;
}
