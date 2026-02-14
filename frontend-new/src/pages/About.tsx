export function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          About ChatterHub
        </h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            ChatterHub is a modern social platform built with cutting-edge technologies
            to provide the best user experience.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Our mission is to connect people and facilitate meaningful conversations
            in a safe and engaging environment.
          </p>
        </div>
      </div>
    </div>
  );
}
