interface HeadingProps {
  title: string
  description?: string
}

export function Heading({ title, description }: HeadingProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm text-gray-700">
          {description}
        </p>
      )}
    </div>
  )
}