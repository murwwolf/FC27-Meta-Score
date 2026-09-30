import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#08080c",
        color: "#fff",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "rgba(255, 0, 60, 0.12)",
          filter: "blur(90px)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "150px",
            height: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "34px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow:
              "0 25px 80px rgba(0,0,0,.6), 0 0 55px rgba(255,0,60,.2)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <img
            src="/logo.png"
            alt="FC27 META"
            style={{
              width: "118px",
              height: "118px",
              objectFit: "contain",
            }}
          />
        </div>

        <div
          style={{
            marginTop: "24px",
            fontSize: "28px",
            fontWeight: 900,
            letterSpacing: "0.08em",
          }}
        >
          FC27 META
        </div>

        <div
          style={{
            marginTop: "10px",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.24em",
            color: "rgba(255,255,255,.45)",
          }}
        >
          ULTIMATE TEAM DATABASE
        </div>

        <div
          style={{
            width: "100px",
            height: "3px",
            marginTop: "34px",
            overflow: "hidden",
            borderRadius: "999px",
            background: "rgba(255,255,255,.1)",
          }}
        >
          <div
            style={{
              width: "45%",
              height: "100%",
              borderRadius: "999px",
              background: "linear-gradient(90deg,#ff174f,#ff3b30,#ffd700)",
              animation: "fc27Loader 900ms ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>
        {`
          @keyframes fc27Loader {
            0% {
              transform: translateX(-110%);
            }
            100% {
              transform: translateX(250%);
            }
          }
        `}
      </style>
    </div>
  )
}
