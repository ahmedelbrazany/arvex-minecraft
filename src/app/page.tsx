"use client";
import Image from "next/image";
import { useRef } from "react";

export default function Home() {
  const introRef = useRef(null);
  const logoRef = useRef(null);
  const servicesRef = useRef(null);
  const serviceItemsRef = useRef<HTMLDivElement[]>([]);
  const whyChooseRef = useRef(null);
  const advantagesRef = useRef<HTMLDivElement[]>([]);
  const noteRef = useRef(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const addToServiceRefs = (el: HTMLDivElement | null): void => {
    if (el && !serviceItemsRef.current.includes(el)) {
      serviceItemsRef.current.push(el);
    }
  };

  const addToAdvantageRefs = (el: HTMLDivElement | null): void => {
    if (el && !advantagesRef.current.includes(el)) {
      advantagesRef.current.push(el);
    }
  };

  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 pt-1 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
      style={
        {
          "--primary-color": "#30c9cd",
          "--secondary-color": "#330d69",
          background:
            "linear-gradient(135deg, rgba(19, 26, 26, 0.05) 0%, rgba(51, 13, 105, 0.08) 100%)",
        } as React.CSSProperties
      }
    >
      <main className="flex flex-col w-full max-w-6xl row-start-2 items-center gap-12">
        {/* القسم العلوي - المقدمة مع اللوجو والمؤسسين */}
        <div
          ref={introRef}
          className="intro-section w-full flex flex-col md:flex-row items-center justify-between gap-8 p-6 rounded-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.07)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* القسم اليمين (النص) */}
          <div className="content-section w-full md:w-3/5 flex flex-col gap-6 text-center md:text-right">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span
                  style={{
                    background: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  ✨ Arvex
                  <span
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "-15px",
                      width: "15px",
                      height: "15px",
                      background: "var(--primary-color)",
                      borderRadius: "50%",
                      filter: "blur(5px)",
                      opacity: "0.8",
                    }}
                  ></span>
                </span>
              </h1>

              <h2 className="text-2xl md:text-3xl font-semibold mb-3 leading-relaxed">
                رؤيتنا الرقمية تتجاوز الحدود
              </h2>

              <p className="text-lg mb-6" style={{ lineHeight: "1.8" }}>
                شركة تقنية متعددة الجنسيات تجمع بين الخبرات العربية في{" "}
                <span className="font-bold">السعودية</span> و{" "}
                <span className="font-bold">مصر</span>، نحن نقود التحول الرقمي
                بأفكار مبتكرة وحلول تقنية متكاملة تناسب عصر السرعة والتطور.
              </p>
            </div>

            <div className="management flex flex-wrap justify-center md:justify-start gap-6 mt-2">
              <div
                className="manager p-3 rounded-lg"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(48, 201, 205, 0.2)",
                }}
              >
                <p
                  className="font-bold text-lg mb-1"
                  style={{ color: "var(--primary-color)" }}
                >
                  أحمد البرزاني
                </p>
                <p className="text-sm">CEO & Software engineer</p>
              </div>
              <div
                className="manager p-3 rounded-lg"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(51, 13, 105, 0.2)",
                }}
              >
                <p
                  className="font-bold text-lg mb-1"
                  style={{ color: "var(--secondary-color)" }}
                >
                  يوسف حبيب
                </p>
                <p className="text-sm">CEO & Software Developer</p>
              </div>
            </div>
          </div>

          {/* القسم اليسار (اللوجو) */}
          <div className="logo relative w-full md:w-2/5 flex justify-center">
            {/* دوائر موجية متعددة خلف اللوجو لإضافة عمق وحركة */}
            <div
              className="blur-circle"
              style={{
                position: "absolute",
                width: "14rem",
                height: "14rem",
                borderRadius: "50%",
                background: "var(--primary-color)",
                opacity: "0.2",
                filter: "blur(200px)",
                zIndex: "-10",
              }}
            ></div>
            <div
              className="blur-circle secondary"
              style={{
                position: "absolute",
                width: "10rem",
                height: "10rem",
                borderRadius: "50%",
                background: "var(--secondary-color)",
                opacity: "0.25",
                filter: "blur(150px)",
                zIndex: "-10",
                transform: "translate(2rem, 1rem)",
              }}
            ></div>

            {/* إطار خفيف حول اللوجو */}
            <div ref={logoRef} className="logo-frame">
              <div className="relative">
                {/* المحتوى */}
                {/* الصورة */}
                <Image
                  src="/arvex-logo.png"
                  alt="Arvex logo"
                  width={250}
                  height={250}
                  priority
                  style={{
                    filter: "drop-shadow(0 8px 16px rgba(48, 201, 205, 0.3))",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* القسم الثاني - الخدمات المتكاملة */}
        <div
          ref={servicesRef}
          className="services w-full p-6 rounded-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.07)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3
            className="text-xl font-bold mb-4 text-center md:text-right"
            style={{
              color: "var(--primary-color)",
              display: "inline-block",
              padding: "0.3rem 1rem",
              background: "rgba(48, 201, 205, 0.1)",
              borderRadius: "2rem",
            }}
          >
            💼 خدماتنا المتكاملة
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              {
                icon: "🖥️",
                title: "تطوير البرمجيات",
                desc: "نبتكر تطبيقات ومواقع إلكترونية عصرية...",
                bg: "rgba(48, 201, 205, 0.05)",
                border: "rgba(48, 201, 205, 0.2)",
              },
              {
                icon: "🎨",
                title: "التصميم الإبداعي",
                desc: "نحول أفكارك لواقع ملموس من خلال تصاميم فريدة...",
                bg: "rgba(51, 13, 105, 0.05)",
                border: "rgba(51, 13, 105, 0.2)",
              },
              {
                icon: "🤖",
                title: "بوتات ديسكورد",
                desc: "روبوتات ذكية مخصصة تمامًا لإدارة مجتمعك...",
                bg: "rgba(48, 201, 205, 0.05)",
                border: "rgba(48, 201, 205, 0.2)",
              },
              {
                icon: "🎮",
                title: "خدمات ماين كرافت",
                desc: "سيرفرات مخصصة بأداء استثنائي...",
                bg: "rgba(51, 13, 105, 0.05)",
                border: "rgba(51, 13, 105, 0.2)",
              },
              {
                icon: "🌐",
                title: "استضافة RDP المتطورة",
                desc: "حلول استضافة آمنة وسريعة بتكلفة منافسة...",
                bg: "rgba(48, 201, 205, 0.05)",
                border: "rgba(48, 201, 205, 0.2)",
                fullWidth: true,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                ref={addToServiceRefs}
                className={`service-item p-4 rounded-lg transition-all ${
                  item.fullWidth ? "sm:col-span-2" : ""
                }`}
                style={{
                  background: item.bg,
                  border: `1px solid ${item.border}`,
                }}
              >
                <h4 className="font-bold mb-2 flex items-center">
                  <span className="inline-block ml-2 text-2xl">
                    {item.icon}
                  </span>
                  <span style={{ color: "var(--primary-color)" }}>
                    {item.title}
                  </span>
                </h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* القسم الثالث - لماذا Arvex */}
        <div
          ref={whyChooseRef}
          className="why-choose w-full p-6 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(48, 201, 205, 0.08) 0%, rgba(51, 13, 105, 0.12) 100%)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.07)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3
            className="text-xl font-bold mb-4 text-center md:text-right"
            style={{
              color: "var(--secondary-color)",
              display: "inline-block",
              padding: "0.3rem 1rem",
              background: "rgba(51, 13, 105, 0.1)",
              borderRadius: "2rem",
            }}
          >
            📝 لماذا{" "}
            <span className="text-2xl font-bold brand-name arvex-gradient-text">
              Arvex
            </span>{" "}
            هي اختيارك الأمثل؟
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div
              ref={addToAdvantageRefs}
              className="advantage p-3 rounded-lg text-center"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(5px)",
              }}
            >
              <div
                className="icon mb-2"
                style={{
                  color: "var(--primary-color)",
                  fontSize: "2rem",
                }}
              >
                ✓
              </div>
              <p className="font-semibold">شركة قانونية معتمدة</p>
            </div>

            <div
              ref={addToAdvantageRefs}
              className="advantage p-3 rounded-lg text-center"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(5px)",
              }}
            >
              <div
                className="icon mb-2"
                style={{
                  color: "var(--primary-color)",
                  fontSize: "2rem",
                }}
              >
                🔐
              </div>
              <p className="font-semibold">عقود إلكترونية وورقية</p>
            </div>

            <div
              ref={addToAdvantageRefs}
              className="advantage p-3 rounded-lg text-center"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(5px)",
              }}
            >
              <div
                className="icon mb-2"
                style={{
                  color: "var(--primary-color)",
                  fontSize: "2rem",
                }}
              >
                ✨
              </div>
              <p className="font-semibold">احترافية في كل خطوة</p>
            </div>
          </div>

          <p className="mt-4 text-center">
            نلتزم بتقديم خدمات احترافية مع ضمان حقوق جميع الأطراف من خلال
            التعاملات القانونية الواضحة والشفافة.
          </p>
        </div>

        {/* القسم الرابع - ملاحظة مهمة */}
        <div
          ref={noteRef}
          className="important-note w-full p-5 rounded-xl"
          style={{
            background:
              "linear-gradient(145deg, rgba(51, 13, 105, 0.2), rgba(48, 201, 205, 0.1))",
            border: "1px dashed var(--secondary-color)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="note-bg-effect"
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              width: "150px",
              height: "150px",
              background:
                "radial-gradient(circle, rgba(48, 201, 205, 0.2) 0%, transparent 70%)",
              zIndex: "1",
            }}
          ></div>

          <div style={{ position: "relative", zIndex: "2" }}>
            <h3 className="text-lg font-bold mb-3 flex items-center justify-center md:justify-start">
              <span className="text-2xl ml-2">📢</span> ملاحظة مهمة:
            </h3>
            <p className="leading-relaxed text-center md:text-right">
              جميع خدماتنا (البوتات، السيرفرات، الاستضافة وغيرها) متوفرة{" "}
              <span className="font-bold">حصريًا من خلالنا</span> وبتعامل رسمي
              فقط. نحرص على تقديم خدمة متكاملة وآمنة لجميع عملائنا.
            </p>
          </div>
        </div>

        {/* زر الدعوة للعمل */}
        <div className="cta w-full flex justify-center mt-2">
          <a
            href="https://discord.gg/arvex"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              ref={ctaRef}
              className="cta-button"
              style={{
                padding: "0.75rem 2rem",
                background: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`,
                color: "white",
                borderRadius: "0.5rem",
                fontWeight: "600",
                boxShadow: "0 4px 20px rgba(48, 201, 205, 0.3)",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                className="cta-glow"
                style={{
                  position: "absolute",
                  top: "-30%",
                  left: "-30%",
                  width: "160%",
                  height: "160%",
                  background:
                    "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                  transform: "rotate(45deg)",
                  transition: "all 0.3s ease",
                }}
              ></span>
              <span style={{ position: "relative", zIndex: "2" }}>
                اكتشف عالمنا الرقمي
              </span>
            </button>
          </a>
        </div>
      </main>
    </div>
  );
}
