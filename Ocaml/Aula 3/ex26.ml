type 'a ntree = NNil | NNode of 'a * 'a ntree list;;

let rec spring v nt =
	match nt with
	 NNil -> NNode(v,[])
	|NNode(x,xs) -> NNode(x,lspring v xs)
	
and
	lspring v l =
		match l with
		 [] -> []
		| t::ts -> spring v t :: lspring v ts
;;
