/** Splits text into inline-block word spans so each word can be animated on its own. */
export default function SplitWords({ text, offsetWord }: { text: string; offsetWord?: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block whitespace-pre will-change-transform" data-word data-offset={offsetWord && w.replace(/[^a-z]/gi, '').toLowerCase() === offsetWord ? '1' : undefined}>
          {w}{' '}
        </span>
      ))}
    </>
  )
}
