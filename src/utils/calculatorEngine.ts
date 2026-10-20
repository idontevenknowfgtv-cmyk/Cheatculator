/**
 * Basic scientific calculator evaluator for normal keypad entries and panic decoy mode.
 * Evaluates expressions like "25 * (4 - 1.2)", "sin(45)", "sqrt(16)", etc.
 */

export function evaluateCasioExpression(expr: string): string {
  if (!expr || !expr.trim()) return '0';

  try {
    // Replace Casio visual symbols with JavaScript Math equivalents
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/\^/g, '**')
      .replace(/π/g, 'Math.PI')
      .replace(/e\b/g, 'Math.E')
      .replace(/Ans/g, '0');

    // Handle functions like sin, cos, tan (in degrees like standard Casio fx-991 [D] mode)
    sanitized = sanitized.replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)');
    sanitized = sanitized.replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)');
    sanitized = sanitized.replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');
    sanitized = sanitized.replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)');
    sanitized = sanitized.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');
    sanitized = sanitized.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
    sanitized = sanitized.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');

    // Only allow safe mathematical characters
    if (!/^[0-9+\-*/().\s,MathPIE*]+$/.test(sanitized)) {
      return 'Syntax ERROR';
    }

    // Evaluate
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${sanitized});`)();

    if (typeof result !== 'number' || isNaN(result)) {
      return 'Math ERROR';
    }
    if (!isFinite(result)) {
      return 'Math ERROR';
    }

    // Format Casio style: up to 10 significant digits
    const str = result.toString();
    if (str.length > 12) {
      // scientific notation or rounded
      return Number(result.toPrecision(10)).toString();
    }
    return str;
  } catch (e) {
    return 'Syntax ERROR';
  }
}
