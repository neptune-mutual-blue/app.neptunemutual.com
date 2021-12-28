export const HomeCard = ({ items }) => {
  return (
    <div className="w-full lg:w-96 h-36 bg-E2EBF7 rounded-2xl flex justify-center items-center">
      {items?.map((item, index) => {
        const firstBorder = index === 0 ? `border-r  border-AABDCB` : ``
         return (
           <div
            key={`home-card-${index}`}
            className={`py-4 flex flex-col justify-center items-center flex-1 ${firstBorder}`}
          >
            <h5 className="text-h5 font-sora text-4E7DD9">{item?.name}</h5>
            <h3 className="text-h3 font-sora text-black font-bold">{item?.amount}</h3>
          </div>
         )
      })}
    </div>
  )
}