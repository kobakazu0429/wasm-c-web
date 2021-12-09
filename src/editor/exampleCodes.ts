export const boilerplate = `#include <stdio.h>

int main() {


  return 0;
}
`;

export const stdin = `#include <stdio.h>

int sum(int a, int b) {
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
  printf("%d + %d = %d\\n", x, y, sum(x, y));
  printf("%d / %d = %3.2f\\n", x, y, div(x, y));
}
`;

export const basic = `#include <stdio.h>
#define foo 123
#define bar 456

int sum(int a, int b) {
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
  for(int i = 0; i < 4; i++) printf("%d\\n", array[i]);

  // address & ptr
  int x = 1;
  int y = 2;

  printf("x = %d, y = %d\\n", x, y);
  printf("&x = %p, &y = %p\\n", &x, &y);

  // function
  printf("%d + %d = %d\\n", x, y, sum(x, y));
  greet("kazu");

  // recursive
  for(int i = 0; i < 6; i++) {
    printf("%d! = ", i);
    for(int j = 1; j <= i; j++) printf("%d %c ", j, j == i ? '=' : '*');
    printf("%d\\n", fact(i));
  }
}
`;

export const peakLoadTest = `#include <stdio.h>
#define MAX 100

int main() {
  int i = 0;
  while (i++ < MAX) {
    printf("%d", i);
  }
}
`;
