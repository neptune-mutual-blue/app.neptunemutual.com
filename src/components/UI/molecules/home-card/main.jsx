export const HomeMainCard = () => {
  return (
    <div
      className="w-full max-w-96 h-36 bg-E2EBF7 rounded-2xl flex flex-col justify-center items-center px-12"
      style={{
        backgroundImage: 'url(/home/bg-pattern.png)'
      }}
    >
      <div className="w-full flex items-center justify-between pb-5">
        <div
          className="flex justify-center items-center"
        >
          <div className="mr-2">
            <img src="/home/home-available-icon.png" alt="home-available" />
          </div>
          <h4 className="text-h4 font-sora">Available</h4>
        </div>
        <div>
          <h4 className="text-h4 text-4E7DD9 font-sora font-bold">30</h4>
        </div>
      </div>

      <div className="w-full flex items-center justify-between">
        <div
          className="flex justify-center items-center"
        >
          <div className="mr-2">
            <img src="/home/home-reporting-icon.png" alt="home-available" />
          </div>
          <h4 className="text-h4 font-sora">Reporting</h4>
        </div>
        <div>
          <h4 className="text-h4 text-4E7DD9 font-sora font-bold">2</h4>
        </div>
      </div>
    </div>
  )
}