# sflow online Examples and Use Cases

This document provides various examples and use cases to illustrate the features and capabilities of the sflow library.

https://sflow-examples.vercel.app/

- [sflow - npm](https://www.npmjs.com/package/sflow)

## sflow Installlation

```bash
npm i sflow
```

## Example 1: Basic Stream Transformation

Transform and filter a stream of numbers.

```typescript
import { sflow } from "sflow";

async function example1() {
  const result = await sflow([1, 2, 3, 4, 5, 6])
    .map((n) => n * 2)
    .log() // Prints: 2, 4, 6, 8, 10, 12
    .filter((n) => n > 6)
    .log() // Prints: 8, 10, 12
    .toArray();

  console.log(result); // Outputs: [8, 10, 12]
}

await example1();

console.log("🚀", "Done");
```

## Example 2: Chunking and Buffering

Chunk the stream into groups of three elements.

```typescript
import { sflow } from "sflow";

async function example2() {
  const result = await sflow([1, 2, 3, 4, 5, 6, 7, 8]).chunk(3).toArray();

  console.log(result); // Outputs: [[1, 2, 3], [4, 5, 6], [7, 8]]
}

await example2();

console.log("🚀", "Done");
```

## Example 3: Debounce and Throttle

Debounce and throttle a stream of events.

```typescript
import { sflow } from "sflow";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function example3() {
  const result = await sflow([1, 2, 3, 4, 5])
    .debounce(100)
    .log() // Prints debounced numbers
    .throttle(200, { drop: true })
    .log() // Prints throttled numbers
    .toArray();

  console.log(result); // Outputs: [2, 4]
}

await example3();

console.log("🚀", "Done");
```

## Example 4: Merging Multiple Streams

Merge multiple streams together.

```typescript
import { sflow } from "sflow";

async function example4() {
  const stream1 = sflow([1, 3, 5]);
  const stream2 = sflow([2, 4, 6]);

  const result = await sflow([stream1, stream2])
    .confluenceByConcat()
    .log() // Prints: 1, 2, 3, 4, 5, 6
    .toArray();

  console.log(result); // Outputs: [1, 2, 3, 4, 5, 6]
}

await example4();

console.log("🚀", "Done");
```

## Example 5: CSV Processing

Parse and format CSV data.

```typescript
import { sflow } from "sflow";
import { csvParses, csvFormats } from "sflow/xsvStreams";

async function example5() {
  const csvData = "name,age\nJohn,30\nJane,25";

  const result = await sflow(csvData)
    .through(csvParses("name,age"))
    .map((record) => ({ ...record, age: Number(record.age) }))
    .log() // Prints parsed records
    .through(csvFormats(["name", "age"]))
    .text();

  console.log(result); // Outputs formatted CSV with modified records
}

await example5();

console.log("🚀", "Done");
```

## Example 6: Unwinding Nested Arrays

Unwind nested arrays within objects.

```typescript
import { sflow } from "sflow";

async function example6() {
  const data = [
    { id: 1, values: [10, 20, 30] },
    { id: 2, values: [40, 50] },
  ];

  const result = await sflow(data)
    .unwind("values")
    .log() // Prints unwound records
    .toArray();

  console.log(result);
  // Outputs:
  // [
  //   { id: 1, values: 10 },
  //   { id: 1, values: 20 },
  //   { id: 1, values: 30 },
  //   { id: 2, values: 40 },
  //   { id: 2, values: 50 }
  // ]
}

await example6();

console.log("🚀", "Done");
```

## Example 7: Stream Concurrency with pMap

Use `pMap` for processing stream items concurrently.

```typescript
import { sflow } from "sflow";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function example7() {
  const result = await sflow([1, 2, 3, 4])
    .pMap(
      async (n) => {
        await sleep(n * 100); // Simulate async work
        return n * 2;
      },
      { concurrency: 2 }
    )
    .log() // Prints: 2, 4, 6, 8
    .toArray();

  console.log(result); // Outputs: [2, 4, 6, 8]
}

await example7();

console.log("🚀", "Done");
```

## Example 8: Reducing and Emitting Intermediate States

Reduce a stream while emitting intermediate states.

```typescript
import { sflow } from "sflow";
import { reduceEmits } from "sflow/reduceEmits";

async function example8() {
  const reducer = (sum, value) => ({
    next: sum + value,
    emit: sum + value,
  });

  const result = await sflow([1, 2, 3, 4])
    .through(reduceEmits(reducer, 0))
    .log() // Prints: 1, 3, 6, 10
    .toArray();

  console.log(result); // Outputs: [1, 3, 6, 10]
}

await example8();

console.log("🚀", "Done");
```

## Example 9: Line-based Stream Processing

Split a string stream into lines and process each line.

```typescript
import { sflow } from "sflow";
import { lines } from "sflow/lines";

async function example9() {
  const text = "line1\nline2\nline3";

  const result = await sflow(text)
    .through(lines())
    .map((line) => line.toUpperCase())
    .log() // Prints: LINE1, LINE2, LINE3
    .join("\n")
    .text();

  console.log(result); // Outputs: LINE1\nLINE2\nLINE3
}

await example9();

console.log("🚀", "Done");
```

## Example 10: Handling Cache with Keyv

Use Keyv for caching stream data.

```typescript
import { sflow } from "sflow";
import Keyv from "keyv";
import { cacheTails } from "sflow/cacheTails";

async function example10() {
  const store = new Keyv({ ttl: 1000 * 60 * 60 }); // Cache for 1 hour

  const fetchAndProcessData = async () => {
    // Simulate data fetching
    const data = [1, 2, 3, 4, 5];
    return sflow(data);
  };

  const dataStream = await fetchAndProcessData();

  const result = await dataStream
    .through(cacheTails(store, "my-cache-key"))
    .log() // Print cached items
    .toArray();

  console.log(result); // Output: [1, 2, 3, 4, 5]
}

await example10();

console.log("🚀", "Done");
```

## Example 11: Aggregating by Key

Aggregate stream items by a specific key.

```typescript
import { sflow } from "sflow";
import { reduceEmits } from "sflow/reduceEmits";

async function example11() {
  const data = [
    { category: "A", value: 10 },
    { category: "B", value: 20 },
    { category: "A", value: 5 },
  ];

  const reducer = (acc, { category, value }) => {
    const next = { ...acc, [category]: (acc[category] || 0) + value };
    return { next, emit: next };
  };

  const result = await sflow(data)
    .through(reduceEmits(reducer, {}))
    .log() // Prints: {"A": 10}, {"A": 10, "B": 20}, {"A": 15, "B": 20}
    .toArray();

  console.log(result);
  // Outputs:
  // [
  //   { "A": 10 },
  //   { "A": 10, "B": 20 },
  //   { "A": 15, "B": 20 }
  // ]
}

await example11();

console.log("🚀", "Done");
```

## Example 12: Stream Vector

Create and process a stream vector.

```typescript
import { svector } from "sflow";

async function example12() {
  const vector = svector(1, 2, 3, 4, 5);

  const result = await vector
    .uniq()
    .map((n) => n * 2)
    .log() // Prints: 2, 4, 6, 8, 10
    .toArray();

  console.log(result); // Outputs: [2, 4, 6, 8, 10]
}

await example12();

console.log("🚀", "Done");
```

## Example 13: Distinct Streams and Combining into Response

Process and respond with distinct streams.

```typescript
import { sflow } from "sflow";
import { uniq } from "sflow/uniq";

async function example13() {
  const stream1 = sflow([1, 2, 3, 2, 1]);
  const stream2 = sflow([4, 5, 5, 6]);

  const distinctStream1 = stream1.uniq();
  const distinctStream2 = stream2.uniq();

  const result = await sflow([distinctStream1, distinctStream2])
    .merge()
    .log() // Prints: 1, 4, 2, 5, 3, 6
    .toArray();

  console.log(result); // Outputs: [1, 4, 2, 5, 3, 6]
}

await example13();

console.log("🚀", "Done");
```

## Example 14: Conditional Chunking

Conditionally chunk a stream using a custom predicate.

```typescript
import { sflow } from "sflow";
import { chunkIfs } from "sflow/chunkIfs";

async function example14() {
  const data = "a,b,c\n1,2,3\nd,s,f";

  const result = await sflow(data.split(""))
    .through(chunkIfs((char) => char !== "\n"))
    .map((chunk) => chunk.join(""))
    .log() // Prints: "a,b,c", "\n", "1,2,3", "\n", "d,s,f"
    .toArray();

  console.log(result); // Outputs: ["a,b,c", "\n", "1,2,3", "\n", "d,s,f"]
}

await example14();

console.log("🚀", "Done");
```

## Example 15: Custom Reducer

Use a custom reducer to process and emit intermediate states.

```typescript
import { sflow } from "sflow";
import { reduceEmits } from "sflow/reduceEmits";

async function example15() {
  const data = [1, 2, 3, 4, 5];

  const customReducer = (sum, value) => ({
    next: sum + value,
    emit: sum + value * 2,
  });

  const result = await sflow(data)
    .through(reduceEmits(customReducer, 0))
    .log() // Prints: 2, 6, 12, 20, 30
    .toArray();

  console.log(result); // Outputs: [2, 6, 12, 20, 30]
}

await example15();

console.log("🚀", "Done");
```

## Example 16: Stream Async Operation

Hold sequential waiting on async operation in stream.

```typescript
import { sflow } from "sflow";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function example16() {
  const data = [1, 2, 3, 4];

  const result = await sflow(data)
    .asyncMap(async (item) => {
      await sleep(item * 100); // Simulate async work
      return item * 2;
    })
    .log() // Prints: 2, 4, 6, 8
    .toArray();

  console.log(result); // Outputs: [2, 4, 6, 8]
}

await example16();

console.log("🚀", "Done");
```

## Example 17: XSV Parsing and Formatting

Parse TSV data and format it back to TSV.

```typescript
import { sflow } from "sflow";
import { tsvParses, tsvFormats } from "sflow/xsvStreams";

async function example17() {
  const tsvData = "name\tage\nJohn\t30\nJane\t25";

  const result = await sflow(tsvData)
    .through(tsvParses("name\tage"))
    .map((record) => ({ ...record, age: Number(record.age) + 1 }))
    .log() // Prints: { name: "John", age: 31 }, { name: "Jane", age: 26 }
    .through(tsvFormats("name\tage"))
    .text();

  console.log(result); // Outputs formatted TSV with updated ages
}

await example17();

console.log("🚀", "Done");
```

## Example 18: Stream Error Handling

Gracefully handle errors within streams.

```typescript
import { sflow } from "sflow";
import { andIgnoreError } from "sflow/andIgnoreError";

async function example18() {
  const data = [1, 2, "three", 4];

  const result = await sflow(data)
    .map((x) => {
      if (typeof x !== "number") {
        throw new Error("Not a number");
      }
      return x * 2;
    })
    .catch(andIgnoreError(/Not a number/))
    .log() // Prints: 2, 4
    .toArray();

  console.log(result); // Outputs: [2, 4]
}

await example18();

console.log("🚀", "Done");
```

## Example 19: Stream Buffering with Interval

Buffer stream items within a time interval.

```typescript
import { sflow } from "sflow";
import { chunkIntervals } from "sflow/chunkIntervals";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function example19() {
  const result = await sflow([1, 2, 3, 4])
    .forEach(() => sleep(50))
    .chunkInterval(100)
    .log() // Prints: [1, 2], [3, 4]
    .toArray();

  console.log(result); // Outputs: [[1, 2], [3, 4]]
}

await example19();

console.log("🚀", "Done");
```

## Example 20: Using TransformStream for Custom Transformations

Implement a custom transformation using `TransformStream`.

```typescript
import { sflow } from "sflow";

async function example20() {
  const uppercaseTransform = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk.toUpperCase());
    },
  });

  const result = await sflow(["hello", "world"])
    .through(uppercaseTransform)
    .log() // Prints: "HELLO", "WORLD"
    .toArray();

  console.log(result); // Outputs: ["HELLO", "WORLD"]
}

await example20();

console.log("🚀", "Done");
```

## Example Basic: Using TransformStream for Custom Transformations

Implement a custom transformation using `TransformStream`.

```typescript
import { sflow } from "sflow";

async function run() {
  let result = await sflow([1, 2, 3, 4])
    .map((n) => n * 2)
    .log((e) => "stage 1 - " + e) // this stage prints 2, 4, 6, 8
    .filter((n) => n > 4)
    .log((e) => "stage 2 - " + e) // this stage prints 6, 8
    .reduce((a, b) => a + b, 0) // first emit 0+6=6, second emit 0+6+8=14
    .log((e) => "stage 3 - " + e) // this stage prints 6, 14
    .toArray();

  console.log(result); // Outputs: [6, 14]
}

await run();
// "stage 1 - 2"
// "stage 1 - 4"
// "stage 1 - 6"
// "stage 2 - 6"    // 2, 4 is filtered out in stage 2
// "stage 1 - 8"
// "stage 3 - 6"    // 0+6
// "stage 2 - 8"
// "stage 3 - 14"   // 0+6+8
// [  6,  14  ]     // results
```

## Un-Nest Promises

```typescript
import { sflow } from "sflow";

async function BEFORE() {
  const url =
    "/music.md";
  // need 4 awaits, 2 extra variables, and fetching is not start by parallel
  let result1 = (await (await fetch(url)).text()).replace(/#.*/gm, "");
  let result2 = (await (await fetch(url)).text()).replace(/#.*/gm, "");
  const result = result1 + "\n" + result2;

  // and it would be even more ugly if you try rewrite it with Promise.all(...)

  console.log(result);
}

async function AFTER() {
  // WIP
  const url =
    "/music.md";
  // need only 1 awaits, reuseable replace logic
  let result = await sflow(fetch(url), fetch(url))
    .map((e) => e.text())
    .replace(/#.*/gm, "")
    .join("\n")
    .text();

  console.log(result);
}

await BEFORE();
await AFTER();
```

## Contribution

1. All PR's and issues welcome! Press `.` in the example repo, and edit as you want, then create

Try to create your first PR here! https://github.dev/snomiao/sflow-examples

2. Join sflow Community by Post Comments here:

- [Welcome to sflow Discussions! · snomiao/sflow · Discussion #2](https://github.com/snomiao/sflow/discussions/2)
