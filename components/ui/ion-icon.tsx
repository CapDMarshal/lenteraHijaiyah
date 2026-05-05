"use client";



export function IonIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  // @ts-expect-error - Custom web component injected via script tag
  return <ion-icon name={name} class={className} />;
}
