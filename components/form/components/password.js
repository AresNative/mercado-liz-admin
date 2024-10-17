"use client";
import { useState } from "react";
import styles from "./inputs.module.css";

export function Password(props) {
  const { cuestion } = props;
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    props.setError(cuestion.name, {});
    props.setValue(cuestion.name, e.target.value);
  };

  return (
    <div className={styles.inputGroup}>
      <input
        required={cuestion.require}
        type={showPassword ? "text" : "password"}
        value={cuestion.valueDefined}
        onChange={handleInputChange}
        {...props.register(cuestion.name, {
          required: cuestion.require && "The field is required.",
        })}
      />
      <label className={styles.label}>{cuestion.placeholder}</label>
      <button onClick={togglePasswordVisibility} type="button">
        {showPassword ? (
          <svg version="1.0" viewBox="0 0 1280.000000 662.000000">
            <g
              transform="translate(0.000000,662.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path d="M6330 6609 c-1718 -102 -3518 -884 -5200 -2260 -336 -274 -685 -593 -956 -873 l-173 -178 91 -99 c144 -156 523 -517 803 -764 1394 -1232 2845 -2012 4275 -2299 486 -97 816 -130 1320 -130 383 -1 517 7 845 49 1372 176 2726 781 3982 1781 517 411 1037 915 1406 1362 l78 93 -27 32 c-463 555 -984 1081 -1491 1504 -1537 1283 -3211 1885 -4953 1782z m464 -584 c362 -42 679 -139 1002 -304 957 -491 1538 -1464 1501 -2511 -22 -585 -223 -1125 -593 -1590 -87 -109 -314 -336 -424 -424 -403 -322 -876 -525 -1410 -607 -214 -33 -590 -33 -810 0 -560 83 -1055 305 -1470 656 -119 101 -310 302 -403 423 -298 389 -481 840 -542 1332 -30 243 -15 583 35 831 237 1162 1221 2047 2440 2193 160 19 514 20 674 1z" />
              <path d="M6325 4819 c-557 -58 -1040 -395 -1274 -889 -180 -380 -196 -802 -47 -1188 166 -430 522 -771 959 -917 203 -68 276 -79 527 -79 212 0 232 1 345 28 147 34 230 64 360 126 437 210 750 611 852 1090 28 130 25 469 -4 600 -58 259 -165 475 -334 677 -331 394 -863 606 -1384 552z" />
            </g>
            <line
              x1="200"
              y1="50"
              x2="1080"
              y2="612"
              stroke="#fff"
              strokeWidth="100"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg version="1.0" viewBox="0 0 1280.000000 662.000000">
            <g
              transform="translate(0.000000,662.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path d="M6330 6609 c-1718 -102 -3518 -884 -5200 -2260 -336 -274 -685 -593 -956 -873 l-173 -178 91 -99 c144 -156 523 -517 803 -764 1394 -1232 2845 -2012 4275 -2299 486 -97 816 -130 1320 -130 383 -1 517 7 845 49 1372 176 2726 781 3982 1781 517 411 1037 915 1406 1362 l78 93 -27 32 c-463 555 -984 1081 -1491 1504 -1537 1283 -3211 1885 -4953 1782z m464 -584 c362 -42 679 -139 1002 -304 957 -491 1538 -1464 1501 -2511 -22 -585 -223 -1125 -593 -1590 -87 -109 -314 -336 -424 -424 -403 -322 -876 -525 -1410 -607 -214 -33 -590 -33 -810 0 -560 83 -1055 305 -1470 656 -119 101 -310 302 -403 423 -298 389 -481 840 -542 1332 -30 243 -15 583 35 831 237 1162 1221 2047 2440 2193 160 19 514 20 674 1z" />
              <path d="M6325 4819 c-557 -58 -1040 -395 -1274 -889 -180 -380 -196 -802 -47 -1188 166 -430 522 -771 959 -917 203 -68 276 -79 527 -79 212 0 232 1 345 28 147 34 230 64 360 126 437 210 750 611 852 1090 28 130 25 469 -4 600 -58 259 -165 475 -334 677 -331 394 -863 606 -1384 552z" />
            </g>
          </svg>
        )}
      </button>
      {props.errors[cuestion.name] && props.errors[cuestion.name].message && (
        <div>
          <span className={styles.danger}>
            {props.errors[cuestion.name].message}
          </span>
        </div>
      )}
    </div>
  );
}
