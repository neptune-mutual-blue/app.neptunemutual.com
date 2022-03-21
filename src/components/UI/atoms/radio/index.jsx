export const Radio = ({ label, id, ...rest }) => {
  return (
    <div className="flex items-center">
      <input
        className="w-5 h-5 mr-2 bg-EEEEEE border-B0C4DB"
        type="radio"
        id={id}
        {...rest}
      />
      <label className="text-sm uppercase" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};
