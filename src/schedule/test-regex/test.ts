const testStrings = [
    // Cases where it should give true
    'r1(x)',
    'w9(Y)',
    'r0(Z)',
    'w5(a)',
    'r7(B)',
    'w2(M)',
    'r4(C)',
    'w8(Q)',
    'r3(K)',
    'w1(G)',
    'r6(P)',
    'w4(T)',
    'r2(D)',
    'w0(S)',
    'r9(H)',
    'w5(I)',
    'r8(F)',
    'w3(J)',
    'r7(L)',
    'w1(N)',
    'r0(O)',
    'w6(U)',
    'r5(V)',
    'w4(W)',
    'r3(X)',
    'w2(Z)',
    'r1(A)',
    'w9(B)',
    'r8(C)',
    'w7(D)',
    'r6(E)',
    'w5(F)',
    'r4(G)',
    'w3(H)',
    'r2(I)',
    'w1(J)',
    'r0(K)',
    'w9(L)',
    'r8(M)',
    'w7(N)',
    'r6(O)',
    'w5(P)',
    'r4(Q)',
    'w3(R)',
    'r2(S)',
    'w1(T)',
    'r0(U)',
    'w9(V)',
    'r8(W)',
    'w7(X)',
    'r6(Y)',
    'w5(Z)',
    'r4(0)',
    'w3(1)', // number instead of char -> FALSE
    'r2(2)', // number instead of char -> FALSE
    'w1(3)', // number instead of char -> FALSE
    'r0(4)', // number instead of char -> FALSE
    'w9(5)', // number instead of char -> FALSE
    'r8(6)', // number instead of char -> FALSE
    'w7(7)', // number instead of char -> FALSE
    'r6(8)', // number instead of char -> FALSE
    'w5(9)', // number instead of char -> FALSE
    'r4(a)',
    'w3(b)',
    'r2(c)',
    'w1(d)',
    'r0(e)',
    'w9(f)',
    'a8(g)',
    '37(h)',
    '46(i)',
    'z5(j)',
    'x4(k)',
    'w3(l)',
    'r2(m)',
    'w1(n)',
    'r0(o)',
    'w9(p)',
    'r8(q)',
    'w7(r)',
    'r6(s)',
    'w5(t)',
    'r4(u)',
    'w3(v)',
    'r2(w)',
    'w1(x)',
    'r0(y)',
    'w9(z)',
  
    // Cases where it should give false
    'r12(z)',    // Second character is more than one digit
    'w33(Z)',    // Second character is more than one digit
    'r(x)',      // Missing the digit after 'r'
    'w10(A',     // Missing the closing parenthesis
    'x3(y)',     // Does not start with 'r' or 'w'
    'r()',       // Missing the digit and the closing parenthesis
    'w11(X)',    // Second character is more than one digit
    'rA(a)',     // Second character is not a digit
    'w(B)',      // Missing the digit after 'w'
    'r5(P',      // Missing the closing parenthesis
    'r1(AZ)',    // Second character is more than one digit
    'w6(9)',     // Second character is more than one digit
    'r4(#)',     // Second character is not a digit or letter
    'w3(_)',     // Second character is not a digit or letter
    'r2(@)',     // Second character is not a digit or letter
    'w1($)',     // Second character is not a digit or letter
    'r0(%)',     // Second character is not a digit or letter
    'w9(^)',     // Second character is not a digit or letter
    'r8(&)',     // Second character is not a digit or letter
    'w7(*a)',    // Second character is more than one digit
    'r6(+)b',    // Second character is more than one digit
    'w5(=)c',    // Second character is more than one digit
    'r4(/)d',    // Second character is more than one digit
    'w3(|)e',    // Second character is more than one digit
    'r2(?)f',    // Second character is more than one digit
    'w1(<)g',    // Second character is more than one digit
    'r0(>)h',    // Second character is more than one digit
    'w9(")i',    // Second character is more than one digit
    'r8(\')j',   // Second character is more than one digit
    'w7(;)',     // Second character is not a digit or letter
    'r6(:)',     // Second character is not a digit or letter
    'w5(,)',     // Second character is not a digit or letter
    'r4(.d)',    // Second character is more than one digit
    'w3(!e)',    // Second character is more than one digit
    'r2(@f)',    // Second character is not a digit or letter
    'w1(#g)',    // Second character is not a digit or letter
    'r0($h)',    // Second character is not a digit or letter
    'w9(%i)',    // Second character is not a digit or letter
    'r8(&j)',    // Second character is not a digit or letter
    'w7(*k)',    // Second character is not a digit or letter
    'r6(=l)',    // Second character is more than one digit
    'w5(/m)',    // Second character is not a digit or letter
    'r4(|n)',    // Second character is not a digit or letter
    'w3(?o)',    // Second character is not a digit or letter
    'r2(>p)',    // Second character is not a digit or letter
    'w1(<q)',    // Second character is not a digit or letter
    'r0("r)',    // Second character is not a digit or letter
    'w9(\')s)',  // Second character is not a digit or letter
    'r8(;t)',    // Second character is not a digit or letter
    'w7(:u)',    // Second character is not a digit or letter
    'r6(,v)',    // Second character is not a digit or letter
    'w5(.w)',    // Second character is not a digit or letter
    'r4(!x)',    // Second character is not a digit or letter
    'w3(@y)',    // Second character is not a digit or letter
    'r2(#z)',    // Second character is not a digit or letter
  ];
  
  const pattern = /^[rw]\d\([a-zA-Z]\)$/;

  
  // Test the strings against the pattern
  testStrings.forEach((str, index) => {
    const result = pattern.test(str);
    console.log(`Test ${str}: ${result}`);
  }); 