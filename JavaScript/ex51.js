class succ {
	
	constructor(a0) {
		this.a0 = a0;
		this.first();
	}
	
	first() {
		this.c = this.a0;
		return this.c;
	}
	
	curr() {
		return this.c;
	}
	
	at(n) {
		this.first();
		for(var i = 0; i < n;i++)
			this.next();
		return this.c;
	}
	
	print(n) {
		this.first();
		for(var i = 0; i < n;i++) {
			console.log(this.curr());
			this.next();
		}
	}
}

class cont extends succ {
	
	constructor(a0) {
		super(a0);
	}
	
	next() {
		return this.curr();
	}
}


class arith extends succ {
	
	constructor(a0, inc) {
		super(a0);
		this.inc = inc;
	}
	
	next() {
		this.c += this.inc;
		return this.c;
	}
}


class geom extends succ {
	
	constructor(a0, mult) {
		super(a0);
		this.mult = mult;
	}
	
	next() {
		this.c *= this.mult;
		return this.c;
	}
}

class bestArith extends arith {
	
	constructor(a0, inc) {
		super(a0,inc);
	}
	
	at(i) {
		var res = this.inc;
		res = this.first() + res*(i-1);
		this.c = res;
		console.log(this.c);
		return this.c
	}
	
}

class compSum extends succ {
	
	constructor(a,b) {
		super(a.first()+b.first());
		this.a = a;
		this.b = b;
	}
	
	first() {
		this.c = this.a.first() + this.b.first();
		return this.c;
	}
	
	next() {
		this.c = this.a.next() + this.b.next();
		return this.c;
	}
	
}

class compAlt extends succ {
		
	constructor(a,b) {
		super(a.first());
		this.a = a;
		this.b = b;
		this.fair = false;
	}
	
	next() {
		if(!this.fair)
			this.c = this.b.next();
		else
			this.c = this.a.next()
		this.fair = !this.fair;
		return this.c;
	}	
}

class filter extends succ {
	
	constructor(a, filtro) {
		super(a.first());
		this.a = a;
		this.filtro = filtro;
	}
	
	next() {
		this.c = this.a.next();
		if(this.c%this.filtro == 0)
			return this.c;
		else
			this.next();
	}
}

class fibonnaci extends succ {
//...	
}

new filter(new arith(2,3),2).print(12);

//3 7 11 15 19 23 27 31 35 39 43 47

//2 5 8 11 14 17 20 23 26 29 32 35

