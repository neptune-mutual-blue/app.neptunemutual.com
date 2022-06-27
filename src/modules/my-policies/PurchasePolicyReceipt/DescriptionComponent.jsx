import { classNames } from "@/utils/classnames";

export const DescriptionComponent = ({
  title,
  text,
  className = "",
  titleClassName = "",
}) => (
  <div className={className}>
    <h2
      className={classNames(
        "font-bold text-receipt-info font-sora",
        titleClassName
      )}
    >
      {title}
    </h2>

    <div className="mt-6 text-lg leading-8">
      {Array.isArray(text) ? (
        <div className="space-y-4">
          {text.map((t, i) =>
            Array.isArray(t) ? (
              <ul key={i} className="pl-6 list-disc">
                {t.map((item, idx) =>
                  Array.isArray(item) ? (
                    <ul className="pl-6 list-disc">
                      {item.map((listItem, index) => (
                        <li key={index}>{listItem}</li>
                      ))}
                    </ul>
                  ) : (
                    <li key={idx}>{item}</li>
                  )
                )}
              </ul>
            ) : (
              <p key={i}>{t}</p>
            )
          )}
        </div>
      ) : (
        <p>{text}</p>
      )}
    </div>
  </div>
);
