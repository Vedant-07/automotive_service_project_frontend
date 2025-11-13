import React from "react";

const NotFound = () => {
  return (
    <section className="flex items-center h-screen p-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl text-slate-400 font-rubik">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl text-white">
            Sorry, we couldn't find this page.
          </p>
          <p className="mt-4 mb-8 text-slate-400">
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <a
            rel="noopener noreferrer"
            href="/"
            className="px-8 py-3 font-semibold rounded bg-gradient-to-r from-cyan-500 to-blue-500 border-none text-slate-900 hover:from-cyan-400 hover:to-sky-400"
          >
            Back to homepage
          </a>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
