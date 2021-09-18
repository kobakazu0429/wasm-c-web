<script lang="ts">
  import loader from "@monaco-editor/loader";
  import { monacoEditorCode } from "../store";

  loader.config({ "vs/nls": { availableLanguages: { "*": "ja" } } });

  const initValue = `#include <stdio.h>

int sum(int a, int b) {
  return a + b;
}

float div(int a, int b) {
  return (float)a / (float)b;
}

int main() {
  setbuf(stdout, NULL);
  int x, y;
  scanf("%d", &x);
  scanf("%d", &y);

  // function
  printf("%d + %d = %d\\n", x, y, sum(x, y));
  printf("%d / %d = %3.2f\\n", x, y, div(x, y));
}
`;

  //   const initValue = `#include <stdio.h>
  // #define foo 123
  // #define bar 456

  // int sum(int a, int b) {
  //   return a + b;
  // }

  // int fact(int n) {
  //   if (n == 0) return 1;
  //   int m = fact(n - 1);
  //   return n * m;
  // }

  // void greet(char name[]) {
  //   printf("Hi, %s\\n", name);
  // }

  // int main() {
  //   setbuf(stdout, NULL);
  //   // normal
  //   int a = 429;
  //   float b = 3.141592;
  //   char c = 'A';
  //   char d[] = "Hello, World!";
  //   printf("%d\\n", a);
  //   printf("%04d\\n", a);
  //   printf("%f\\n", b);
  //   printf("%3.2f\\n", b);
  //   printf("%c\\n", c);
  //   printf("%s\\n", d);

  //   // define
  //   printf("%d + %d = %d\\n", foo, bar, foo + bar);

  //   // array
  //   int array[] = {0, 1, 2, 3};
  //   for(int i = 0; i < 4; i++) printf("%d\\n", array[i]);

  //   // address & ptr
  //   int x = 1;
  //   int y = 2;

  //   printf("x = %d, y = %d\\n", x, y);
  //   printf("&x = %p, &y = %p\\n", &x, &y);

  //   // function
  //   printf("%d + %d = %d\\n", x, y, sum(x, y));
  //   greet("kazu");

  //   // recursive
  //   for(int i = 0; i < 6; i++) {
  //     printf("%d! = ", i);
  //     for(int j = 1; j <= i; j++) printf("%d %c ", j, j == i ? '=' : '*');
  //     printf("%d\\n", fact(i));
  //   }
  // }
  // `;

  monacoEditorCode.update(() => initValue);

  loader.init().then((monaco) => {
    const newEditor = monaco.editor.create(document.querySelector("#editor")!, {
      value: initValue,
      language: "c",
      theme: "vs-dark",
      scrollbar: {
        arrowSize: 11,
      },
      fontSize: 16,
      wordWrap: "on",
      minimap: {
        enabled: false,
      },
      lineNumbers: "on",
    });
    newEditor.updateOptions({ tabSize: 2 });
    newEditor.onDidChangeModelContent((_event: any) => {
      const value = newEditor.getValue();
      // props.onChangeValue(value);
      monacoEditorCode.update(() => value);
    });
    // console.log(monaco.languages.getLanguages());
    // @ts-ignore
    // console.log(newEditor._themeService._knownThemes);
    // monaco.editor.defineTheme("One Dark Pro")
    // const rect = editorRef.current.getBoundingClientRect();
    // newEditor.layout({ width: rect.width, height: rect.height });
    // props.focusWithDidMount && newEditor.focus();

    // return () => {
    //   // const p = newEditor.getPosition();
    //   // const offset = newEditor.getOffsetForColumn(p.lineNumber, p.column);
    //   newEditor.dispose();
    // };
  });
</script>

<div id="editor" />

<style>
  #editor {
    height: 100%;
  }
</style>
