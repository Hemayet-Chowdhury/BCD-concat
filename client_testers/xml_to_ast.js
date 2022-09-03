const { parse } = require("@xml-tools/parser");
const { buildAst, accept } = require("@xml-tools/ast");

// const xmlText = `<note>
//                      <to>Bill</to>
//                      <from>Tim</from>
//                  </note>
// `;

const xmlText = `<exprlist>
  <expr line1="1" col1="1" line2="3" col2="1" start="48" end="142">
    <expr line1="1" col1="1" line2="1" col2="7" start="48" end="54">
      <SYMBOL line1="1" col1="1" line2="1" col2="7" start="48" end="54">myFunc1</SYMBOL>
    </expr>
    <LEFT_ASSIGN line1="1" col1="9" line2="1" col2="10" start="56" end="57">&lt;-</LEFT_ASSIGN>
    <expr line1="1" col1="12" line2="3" col2="1" start="59" end="142">
      <FUNCTION line1="1" col1="12" line2="1" col2="19" start="59" end="66">function</FUNCTION>
      <OP-LEFT-PAREN line1="1" col1="20" line2="1" col2="20" start="67" end="67">(</OP-LEFT-PAREN>
      <SYMBOL_FORMALS line1="1" col1="21" line2="1" col2="21" start="68" end="68">a</SYMBOL_FORMALS>
      <OP-COMMA line1="1" col1="22" line2="1" col2="22" start="69" end="69">,</OP-COMMA>
      <SYMBOL_FORMALS line1="1" col1="23" line2="1" col2="23" start="70" end="70">b</SYMBOL_FORMALS>
      <EQ_FORMALS line1="1" col1="24" line2="1" col2="24" start="71" end="71">=</EQ_FORMALS>
      <expr line1="1" col1="25" line2="1" col2="25" start="72" end="72">
        <NUM_CONST line1="1" col1="25" line2="1" col2="25" start="72" end="72">5</NUM_CONST>
      </expr>
      <OP-COMMA line1="1" col1="26" line2="1" col2="26" start="73" end="73">,</OP-COMMA>
      <SYMBOL_FORMALS line1="1" col1="28" line2="1" col2="28" start="75" end="75">c</SYMBOL_FORMALS>
      <EQ_FORMALS line1="1" col1="30" line2="1" col2="30" start="77" end="77">=</EQ_FORMALS>
      <expr line1="1" col1="32" line2="1" col2="32" start="79" end="79">
        <NUM_CONST line1="1" col1="32" line2="1" col2="32" start="79" end="79">7</NUM_CONST>
      </expr>
      <OP-COMMA line1="1" col1="33" line2="1" col2="33" start="80" end="80">,</OP-COMMA>
      <SYMBOL_FORMALS line1="1" col1="35" line2="1" col2="35" start="82" end="82">d</SYMBOL_FORMALS>
      <OP-COMMA line1="1" col1="37" line2="1" col2="37" start="84" end="84">,</OP-COMMA>
      <SYMBOL_FORMALS line1="1" col1="39" line2="1" col2="39" start="86" end="86">e</SYMBOL_FORMALS>
      <EQ_FORMALS line1="1" col1="41" line2="1" col2="41" start="88" end="88">=</EQ_FORMALS>
      <expr line1="1" col1="43" line2="1" col2="44" start="90" end="91">
        <NUM_CONST line1="1" col1="43" line2="1" col2="44" start="90" end="91">10</NUM_CONST>
      </expr>
      <OP-RIGHT-PAREN line1="1" col1="45" line2="1" col2="45" start="92" end="92">)</OP-RIGHT-PAREN>
      <expr line1="1" col1="46" line2="3" col2="1" start="93" end="142">
        <OP-LEFT-BRACE line1="1" col1="46" line2="1" col2="46" start="93" end="93">{</OP-LEFT-BRACE>
        <expr line1="2" col1="3" line2="2" col2="12" start="97" end="106">
          <expr line1="2" col1="3" line2="2" col2="7" start="97" end="101">
            <SYMBOL_FUNCTION_CALL line1="2" col1="3" line2="2" col2="7" start="97" end="101">print</SYMBOL_FUNCTION_CALL>
          </expr>
          <OP-LEFT-PAREN line1="2" col1="8" line2="2" col2="8" start="102" end="102">(</OP-LEFT-PAREN>
          <expr line1="2" col1="9" line2="2" col2="11" start="103" end="105">
            <expr line1="2" col1="9" line2="2" col2="9" start="103" end="103">
              <SYMBOL line1="2" col1="9" line2="2" col2="9" start="103" end="103">a</SYMBOL>
            </expr>
            <OP-PLUS line1="2" col1="10" line2="2" col2="10" start="104" end="104">+</OP-PLUS>
            <expr line1="2" col1="11" line2="2" col2="11" start="105" end="105">
              <SYMBOL line1="2" col1="11" line2="2" col2="11" start="105" end="105">b</SYMBOL>
            </expr>
          </expr>
          <OP-RIGHT-PAREN line1="2" col1="12" line2="2" col2="12" start="106" end="106">)</OP-RIGHT-PAREN>
        </expr>
        <OP-RIGHT-BRACE line1="3" col1="1" line2="3" col2="1" start="142" end="142">}</OP-RIGHT-BRACE>
      </expr>
    </expr>
  </expr>
  <expr line1="6" col1="1" line2="8" col2="1" start="283" end="377">
    <expr line1="6" col1="1" line2="6" col2="7" start="283" end="289">
      <SYMBOL line1="6" col1="1" line2="6" col2="7" start="283" end="289">myFunc1</SYMBOL>
    </expr>
    <LEFT_ASSIGN line1="6" col1="9" line2="6" col2="10" start="291" end="292">&lt;-</LEFT_ASSIGN>
    <expr line1="6" col1="12" line2="8" col2="1" start="294" end="377">
      <FUNCTION line1="6" col1="12" line2="6" col2="19" start="294" end="301">function</FUNCTION>
      <OP-LEFT-PAREN line1="6" col1="20" line2="6" col2="20" start="302" end="302">(</OP-LEFT-PAREN>
      <SYMBOL_FORMALS line1="6" col1="21" line2="6" col2="21" start="303" end="303">a</SYMBOL_FORMALS>
      <EQ_FORMALS line1="6" col1="22" line2="6" col2="22" start="304" end="304">=</EQ_FORMALS>
      <expr line1="6" col1="23" line2="6" col2="23" start="305" end="305">
        <NUM_CONST line1="6" col1="23" line2="6" col2="23" start="305" end="305">7</NUM_CONST>
      </expr>
      <OP-COMMA line1="6" col1="24" line2="6" col2="24" start="306" end="306">,</OP-COMMA>
      <SYMBOL_FORMALS line1="6" col1="25" line2="6" col2="25" start="307" end="307">b</SYMBOL_FORMALS>
      <EQ_FORMALS line1="6" col1="26" line2="6" col2="26" start="308" end="308">=</EQ_FORMALS>
      <expr line1="6" col1="27" line2="6" col2="27" start="309" end="309">
        <NUM_CONST line1="6" col1="27" line2="6" col2="27" start="309" end="309">6</NUM_CONST>
      </expr>
      <OP-RIGHT-PAREN line1="6" col1="28" line2="6" col2="28" start="310" end="310">)</OP-RIGHT-PAREN>
      <expr line1="6" col1="29" line2="8" col2="1" start="311" end="377">
        <OP-LEFT-BRACE line1="6" col1="29" line2="6" col2="29" start="311" end="311">{</OP-LEFT-BRACE>
        <expr line1="7" col1="3" line2="7" col2="12" start="332" end="341">
          <expr line1="7" col1="3" line2="7" col2="7" start="332" end="336">
            <SYMBOL_FUNCTION_CALL line1="7" col1="3" line2="7" col2="7" start="332" end="336">print</SYMBOL_FUNCTION_CALL>
          </expr>
          <OP-LEFT-PAREN line1="7" col1="8" line2="7" col2="8" start="337" end="337">(</OP-LEFT-PAREN>
          <expr line1="7" col1="9" line2="7" col2="11" start="338" end="340">
            <expr line1="7" col1="9" line2="7" col2="9" start="338" end="338">
              <SYMBOL line1="7" col1="9" line2="7" col2="9" start="338" end="338">a</SYMBOL>
            </expr>
            <OP-MINUS line1="7" col1="10" line2="7" col2="10" start="339" end="339">-</OP-MINUS>
            <expr line1="7" col1="11" line2="7" col2="11" start="340" end="340">
              <SYMBOL line1="7" col1="11" line2="7" col2="11" start="340" end="340">b</SYMBOL>
            </expr>
          </expr>
          <OP-RIGHT-PAREN line1="7" col1="12" line2="7" col2="12" start="341" end="341">)</OP-RIGHT-PAREN>
        </expr>
        <OP-RIGHT-BRACE line1="8" col1="1" line2="8" col2="1" start="377" end="377">}</OP-RIGHT-BRACE>
      </expr>
    </expr>
  </expr>
</exprlist>
`;

const { cst, tokenVector } = parse(xmlText);
const xmlDocAst = buildAst(cst, tokenVector);

// A Visitor allows us to invoke actions on the XML ASTNodes without worrying about
// The XML AST structure / traversal method.
const printVisitor = {
  // Will be invoked once for each Element node in the AST.
  visitXMLElement: function (node) {
    console.log("node name : " + node.name);
    var contents = node.textContents;
    var res = "";
    contents.forEach((d) => {
      res += " " + d.text;
    });
    console.log(res);
  },

  // An XML AST Visitor may have other methods as well, see the api.d.ts file/
};

// Invoking the Visitor
accept(xmlDocAst, printVisitor);
