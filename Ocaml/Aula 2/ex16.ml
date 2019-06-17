let rec nat x =
	if x = 0 then
		[]
	else
		( x - 1)::nat (x - 1)
;;

let rec pack l = 
	match l with
	 [] -> []
	| x::xs -> (x, 1)::pack xs
;;
