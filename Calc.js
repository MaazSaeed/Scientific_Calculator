function evaluate(expr,context)
{  
  // add functionalities like cos, sin, tan, log etc into the operations object
  expr = expr.match(/[a-z\d]+|\,|\bPI\d*|\bPI2|\===|\d+|\+|\-|\*|\/|\(|\)/g);
	let len = expr.length;
  // replacing the variables with their values and turning constants from 
  // string to numbers
  for(let e = 0; e < len; ++e)
  {
    if(context == null)
      expr[e] = true || context[expr[e]] || +expr[e] || expr[e];
    else
      expr[e] = +expr[e] || expr[e];
  }

  // shunting yard algorithm to go from infix to postfix
  let stack = [];
  let queue = [];
  for(let i = 0; i < len; ++i)
  {
  	let ch = expr[i];    
    if(ch == '(')
    	stack.push(ch);
    else if(!isNaN(ch))
        queue.push(ch);
    else if(ch == ')')
    {
    	while(stack.length && stack[stack.length - 1] != '(')
			queue.push(stack.pop());
    	stack.pop();
	}
  else if(ch == ',')
  {
    let p = stack[stack.length - 1];
    if(p != '(')
      queue.push(p), stack.pop();
  } 
  
	else
    {
    	if(precedence(ch) > precedence(stack[stack.length - 1]))
            stack.push(ch);
        else
        {
          while(stack.length && precedence(ch) <= precedence(stack[stack.length - 1]))
            queue.push(stack.pop());
          stack.push(ch);
        }
    }
  }

	while(stack.length)
      queue.push(stack.pop());
  
  for(let e = 0; e < queue.length; e++)
    if(queue[e] == 'abs' && queue[e - 1] == '-')
      queue[e - 2] *= -1, queue[e - 1] = '';
      
  queue = queue.filter(e => e != '');

	let ops =
    { '+' :  (a, b) => a + b,
      '-' : (a, b) => b - a,
      '*' : (a, b) => b * a,
      '/' : (a, b) => b / a,
      '===' : (a, b) => a === b,
      'log' : (a) => Math.log(a),
      'sin2':(a, b) => Math.sin(a)**2,
      'cos2':(a, b) => Math.cos(a)**2,
      'PI' : 3.141592653589793,
      'PI2' : (3.141592653589793)**2,
      'pow' : (a, b) => b**a,
      'tan' : (a) => Math.tan(a),
      'sin' : (a) => Math.sin(a),
      'cos' : (a) => Math.cos(a),
      'min' : (...args) => Math.min(args),
      'abs' : (a) => a >= 0 ? a : -1 * a,
      'floor': (a) => a | 0,
      'random' : () => Math.random(),
      'ceil' : (a) => (a | 0) + 1,
    };

	let qlen = queue.length;
	let nums = [];
  
	for(let i = 0; i < qlen; ++i)
    {
      
      let ch = queue[i];

      if(!isNaN(queue[i]))
      	nums.push(queue[i]);
      else if(ch == 'random')
        nums.push(ops[ch]());
      else if(ch == 'ceil')
        nums.push(ops[ch](nums.pop()));
      else if(ch == 'floor')
        nums.push(ops[ch](nums.pop()));
      else if(ch == '+' || ch == '-' || ch == '*' || ch == '/' || ch == 'pow'  || ch == '===')
      {
        let a = nums.pop();
        let b = nums.pop();
        nums.push(ops[queue[i]](a, b));
      }
      else if(ch == 'PI' || ch == 'PI2')
        nums.push(ops[ch]);
      else
      {
        let p = nums.pop();
      	nums.push(ops[ch](p));
      }
    }
  return nums.pop();
}

function precedence(ch)
{
  if(ch == '(' || ch == ')' || ch == '===')
    return 0;
  if(ch == '+' || ch == '-')
    return 1;
  if(ch == '*' || ch == '/')
    return 2;
  if(ch != '+' && ch != '-' && ch != '*' && ch != '/')
    return 3;
  return 0;
}
