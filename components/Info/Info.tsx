import React from "react";

export default function Info() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start p-6">
      <div className="mt-[-2rem] mb-4 text-3xl text-gray-900 opacity-80">
        Quick Guide
      </div>
      <div className="flex flex-col gap-3 space-y-2 p-4 pt-0 pb-0 text-2xl text-gray-800">
        {/* Cycle */}
        <div>
          <div className="opacity-70">Cycle:</div>
          <div>1 study session + 1 break.</div>
        </div>
        {/* Breaks and Intervals */}
        <div>
          <div className="opacity-70">Breaks</div>
          <div>There are 3 types of breaks:</div>
          <ul className="list-disc pl-10">
            <li>Break (the break in the cycle)</li>
            <li>Short Break (after a set number of cycles)</li>
            <li>Long Break (after a set number of cycles)</li>
          </ul>
        </div>
        {/* Breaks and Intervals */}
        <div>
          <div className="opacity-70">Short/Long Break Intervals:</div>
          <div>Set the number of cycles before a short or long break.</div>
          <div>
            For example, setting the short break interval to 5 means a short
            break will occur every 5 cycles.
          </div>
        </div>
        {/* Background Audio */}
        <div>
          <div className="opacity-70">Background Audio:</div>
          <div>
            Ambient sounds help focus—adjust volume or pause during breaks.
          </div>
        </div>
      </div>
      <p className="mt-4 text-2xl text-gray-700 opacity-85">
        Change these in the Settings menu.
      </p>
    </div>
  );
}
