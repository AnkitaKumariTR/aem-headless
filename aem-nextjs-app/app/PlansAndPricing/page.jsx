import Link from "next/link"

export default function AdventureCard({
  slug,
  title,
  price,
  duration,
  imageSrc,
}) {
  console.log({ slug, title, price, duration, imageSrc })
  return (
    <div key={slug} className="group relative">
      test
    </div>
  )
}

