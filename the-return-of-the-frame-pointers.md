# The Return of the Frame Pointers - A Profiler's Dream Come True

![Profiling the depths of stack traces](https://www.brendangregg.com/FlameGraphs/cpu-bash-flamegraph.svg)

Have you ever felt the frustration of working with a profiler and realizing the results you’re gazing at seem… incomplete? If you have, you're not alone. For years, developers, SREs, and performance engineers have grappled with the silent issue of partial stack traces, leading to a somewhat murky understanding of what our programs spend time on. But, ladies and gentlemen, brace yourselves: **the frame pointers are making a triumphant return**, and with them, a promise of clearer, more insightful profiling sessions.

## The Good Old Days

Once upon a time, frame pointers were our trusty allies in the world of debugging and performance profiling. They made stack walking—tracing the call stack during a program's execution—a straightforward task. However, circa 2004, the winds changed. Compilers, in the quest for optimization, began omitting frame pointers, arguing that it frees up a register for other uses, purportedly improving performance.

This change, initially for the betterment of execution speed (especially on i386 architectures), came with an unforeseen price: **broken debuggers and profilers**. Tools that relied on frame pointers for stack walking were suddenly either partially blind or left groping in the dark. The irony? This performance optimization was less consequential for 64-bit systems, which had plenty of registers to spare. Yet, the practice continued, blurring our view into our programs' inner workings.

## The Profiler's Plight

Imagine consulting your profiler, only to find a significant chunk of execution time attributed to `[unknown]`. That's been our collective quandary. Libraries compiled without frame pointers, such as the standard C library (libc), have been throwing our tools off the scent, making them lose track halfway through the chase.

Take, for example, a [CPU flame graph](https://www.brendangregg.com/FlameGraphs/cpu-bash-flamegraph.svg) partially showing the bash shell's activity. It’s akin to reading a mystery novel only to discover the last few chapters are missing. What's causing that bump in CPU usage? The plot thickens, but without all the pages, we're left guessing.

## A New Dawn for Debugging

Now, for the good news: **Fedora and Ubuntu have decided to compile libc with frame pointers by default**! This might seem like a small tweak, but its implications are vast. Suddenly, those flame graphs that looked like modern art pieces start making sense. Off-CPU profiling, a tricky endeavor at the best of times, becomes not just feasible but downright informative.

### What Makes Frame Pointers So Special?

To the uninitiated, frame pointers might seem like just another piece in the complex puzzle of a computer program. However, for those of us donning the profiler's hat, they're nothing short of magic keys unlocking detailed maps of program execution.

With frame pointers, each function call is a well-documented journey, complete with breadcrumbs leading back to where we came from. This meticulous recording allows tools to trace the execution stack accurately, painting a comprehensive picture of what a program does—and more importantly, where it spends its time.

### Beyond the Present: A Glimpse Into the Future

While Fedora and Ubuntu taking steps to enable frame pointers by default is a significant victory, it's merely a waypoint in our journey toward better performance insights. Technologies like [SFrames](https://lwn.net/Articles/932209/) and [Shadow Stacks](https://lwn.net/Articles/885220/), promising even finer-grained control and visibility, are on the horizon. They hint at a future where profiling and debugging could become as intuitive and insightful as reading a book—with all the chapters included.

## A Collective Triumph

This progress isn't just a win for Fedora and Ubuntu users—it's a triumph for the entire developer community. It highlights the importance of tools that let us peer deep into our software, understanding not just the 'what' but the 'why' of performance.

So, here's to the return of the frame pointers, to the tireless developers advocating for better tools, and to a future where we can explore the depths of our programs with crystal clarity. May our flame graphs always be complete, our profilers accurately informed, and our debugging sessions enlightening.

Thank you, Fedora and Ubuntu, for listening to the community and for taking a step that, while seemingly small, will light up the path of performance tuning and debugging for many.

---

_Disclaimer: The views and examples mentioned in this blog are based on the author's experience and collected anecdotes from the developer community. Individual results with frame pointers and profiling techniques may vary._

---

Whether it's walking through your application's call stack or debugging a pesky performance bottleneck, these developments mark a turning point. Don't forget to update your distributions come 2024, and here’s to uncovering the hidden stories in our software, one flame graph at a time!

__[Home](/blog/index.html)__  |  __[Recent Posts](#Recent-posts)__