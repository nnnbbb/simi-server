import { expressionParser, transformExpression } from "../../src/utils/expression.util";


function testExpressionIncludes1() {
  let expression = '(( $11 == 22 && $11 includes $22, $23, $24 || $5 >= $6 )) && ( $7 == $8 )';
  let exprObject = expressionParser(expression)
  console.log('test ExpressionIncludes exprObject ->', exprObject)
}
function testExpressionIncludes2() {
  let expression = '(( $11 == 22 &&  $5 >= $6 )) && ( $7 == $8 ) || $11 includes $22, $23, $24, $25';
  let exprObject = expressionParser(expression)
  console.log('test ExpressionIncludes exprObject ->', exprObject)
}
function testExpressionIncludes3() {
  let expression = '(( $11 == 22 &&  $5 >= $6 )) && ( $7 == $8 ) || $11 includes 22, 23, 24, 25';
  let exprObject = expressionParser(expression)
  console.log('test ExpressionIncludes exprObject ->', exprObject)
}
function testExpression1() {
  let expression = '(( $11 == 22 && $33 >= $4 || $5 >= $6 )) && ( $7 == $8 )';
  let exprObject = expressionParser(expression)
  console.log('test testExpression1 exprObject ->', exprObject)
}
function testExpression2() {
  let expression = 'includes($1, [10, 1])';
  let exprObject = expressionParser(expression)
  console.log('test testExpression2 exprObject ->', exprObject)
}
function testExpression3() {
  let expression = 'includes($1, "10, 1") ';
  let exprObject = expressionParser(expression)
  console.log('test testExpression3 exprObject ->', exprObject)
}
function testExpression4() {
  let expression = ' includes($1, { k: "v" }) && ( $11 == 22 &&  $5 >= $6 )';
  let exprObject = expressionParser(expression)
  console.log('test testExpression4 exprObject ->', exprObject)
}
function testExpression5() {
  let expression = ' noIncludes($1, [10, "1"]) && ( $11 == 22 &&  $5 >= $6 )';
  let exprObject = expressionParser(expression)
  console.log('test testExpression5 exprObject ->', exprObject)
}
function testTransformExpression1() {
  let expression = '(( $11 < 22 &&  $5 > $6 )) && ( $7 >= $8 ) || ($1 <= 10 )';
  let newExpression = transformExpression(expression, {
    ">": "gt",
    ">=": "gte",
    "<": "lt",
    "<=": "lte",
  })
  console.log('test testTransformExpression1 newExpression ->', newExpression)
}
function testTransformExpression2() {
  let expression = '($1 > 175) &&($2 < 130) || ( includes($3, $4) ) || noIncludes($33, $44)';
  let newExpression = transformExpression(expression, {
    ">": "gt",
    ">=": "gte",
    "<": "lt",
    "<=": "lte",
  })
  console.log('test testTransformExpression2 newExpression ->', newExpression)
}
function testTransformExpression3() {
  let expression = "(includes($1,'未见'))";
  let newExpression = transformExpression(expression, {
    ">": "gt",
    ">=": "gte",
    "<": "lt",
    "<=": "lte",
  })
  console.log('test testTransformExpression3 newExpression ->', newExpression)
}
function testIncludesCheckboxExpression1() {
  let expression = "( includesCheckbox($1, '异常') )";
  let newExpression = transformExpression(expression, {
    ">": "gt",
    ">=": "gte",
    "<": "lt",
    "<=": "lte",
  })
  console.log('test includesCheckbox transformExpression newExpression ->', newExpression)
}
function testIncludesCheckboxExpressionParser() {
  let expression = "( includesCheckbox($1, '异常') )";
  let exprObject = expressionParser(expression)
  console.log('test includesCheckbox expression parser exprObject ->', exprObject)
}


function test() {
  testExpression1()
  testExpression2()
  testExpression3()
  testExpression4()
  testExpression5()
  testExpressionIncludes1()
  testTransformExpression1()
  testTransformExpression2()
  testTransformExpression3()
  testIncludesCheckboxExpression1()
  testIncludesCheckboxExpressionParser()
}

if (require.main === module) {
  test()
}
