export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Sign Up with Google',
      description: 'Quick and secure sign-up using your Google account. Get started in seconds.',
    },
    {
      number: '2',
      title: 'Create Your Profile',
      description: 'Share your tennis journey, skill level, and what you\'re looking for in the community.',
    },
    {
      number: '3',
      title: 'Start Connecting',
      description: 'Post discussions, browse equipment, find hitting partners, and engage with the community.',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
