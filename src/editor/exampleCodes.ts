import type { Test } from "../test";

export const boilerplate = `#include <stdio.h>

int main() {


  return 0;
}
`;

export const stdin = `#include <stdio.h>

int add(int a, int b) {
  return a + b;
}

float div(int a, int b) {
  return (float)a / (float)b;
}

int main() {
  int x, y;
  scanf("%d", &x);
  scanf("%d", &y);

  // function
  printf("%d + %d = %d\\n", x, y, add(x, y));
  printf("%d / %d = %3.2f\\n", x, y, div(x, y));
}
`;

export const stdinTests: Test[] = [
  {
    type: "function",
    id: "stdinTests_id_1",
    testName: "add(1, 2) should be 3",
    functionName: "add",
    argumentsValues: [
      { type: "int", value: 1 },
      { type: "int", value: 2 }
    ],
    returnValue: {
      type: "int",
      value: 3
    },
    returnPrecision: 0
  },
  {
    type: "function",
    id: "stdinTests_id_2",
    testName: "div(8, 2) should be 4",
    functionName: "div",
    argumentsValues: [
      { type: "int", value: 8 },
      { type: "int", value: 2 }
    ],
    returnValue: {
      type: "int",
      value: 4
    },
    returnPrecision: 0
  },
  {
    type: "function",
    id: "stdinTests_id_3",
    testName: "div(10, 3) should be 3.3333",
    functionName: "div",
    argumentsValues: [
      { type: "int", value: 10 },
      { type: "int", value: 3 }
    ],
    returnValue: {
      type: "float",
      value: 3.3333
    },
    returnPrecision: 4
  },
  {
    type: "main",
    id: "stdinTests_id_4",
    testName: "e2e",
    functionName: "main",
    stdin: ["20", "7"],
    stdout: "20 + 7 = 27\n20 / 7 = 2.86\n"
  }
];

export const basic = `#include <stdio.h>
#define foo 123
#define bar 456

int add(int a, int b) {
  return a + b;
}

int fact(int n) {
  if (n == 0) return 1;
  int m = fact(n - 1);
  return n * m;
}

void greet(char name[]) {
  printf("Hi, %s\\n", name);
}

int main() {
  // normal
  int a = 429;
  float b = 3.141592;
  char c = 'A';
  char d[] = "Hello, World!";
  printf("%d\\n", a);
  printf("%04d\\n", a);
  printf("%f\\n", b);
  printf("%3.2f\\n", b);
  printf("%c\\n", c);
  printf("%s\\n", d);

  // define
  printf("%d + %d = %d\\n", foo, bar, foo + bar);

  // array
  int array[] = {0, 1, 2, 3};
  for(int i = 0; i < sizeof(array) / sizeof(int); i++) printf("%d\\n", array[i]);

  // address & ptr
  int x = 1;
  int y = 2;

  printf("x = %d, y = %d\\n", x, y);
  printf("&x = %p, &y = %p\\n", &x, &y);

  // function
  printf("%d + %d = %d\\n", x, y, add(x, y));
  greet("kazu");

  // recursive
  for(int i = 0; i < 6; i++) {
    printf("%d! = ", i);
    for(int j = 1; j <= i; j++) printf("%d %c ", j, j == i ? '=' : '*');
    printf("%d\\n", fact(i));
  }
}
`;

export const basicTests: Test[] = [
  {
    type: "main",
    id: "basicTests_id_1",
    testName: "e2e",
    functionName: "main",
    stdin: [],
    stdout:
      "429\n0429\n3.141592\n3.14\nA\nHello, World!\n123 + 456 = 579\n0\n1\n2\n3\nx = 1, y = 2\n&x = 0x11318, &y = 0x11314\n1 + 2 = 3\nHi, kazu\n0! = 1\n1! = 1 = 1\n2! = 1 * 2 = 2\n3! = 1 * 2 * 3 = 6\n4! = 1 * 2 * 3 * 4 = 24\n5! = 1 * 2 * 3 * 4 * 5 = 120\n"
  }
];

export const peakLoadTest = `#include <stdio.h>
#define MAX 100

int main() {
  int i = 0;
  while (i++ < MAX) {
    printf("%d", i);
  }
}
`;

export const peakLoadTestTests: Test[] = [
  {
    type: "main",
    id: "peakLoadTestTests_id_1",
    testName: "e2e",
    functionName: "main",
    stdin: [],
    stdout:
      "123456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899100"
  }
];
