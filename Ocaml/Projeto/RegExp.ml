(* RegExp module body *)

(* 
Aluno 1: Pedro Valente nº 50759 
Aluno 2: Rafael Gameiro nº 50677

Comment:

?????????????????????????
?????????????????????????
?????????????????????????
?????????????????????????
?????????????????????????
?????????????????????????

*)

(*
01234567890123456789012345678901234567890123456789012345678901234567890123456789
   80 columns
*)


(* REGULAR EXPRESSIONS *)

type regExp =
      Str of string
    | Class of string
    | NClass of string
    | Any
    | Seq of regExp * regExp
    | Or of regExp * regExp
    | Not of regExp
    | Zero of regExp
    | ZeroOrOne of regExp
    | ZeroOrMore of regExp
    | OneOrMore of regExp
    | Repeat of int * int * regExp
;;


(* STRINGS *)

let cut s =
    (String.get s 0, String.sub s 1 ((String.length s)-1))
;;

let join x xs =
    (Char.escaped x)^xs
;;

let rec list_of_string s =
    if s = "" then []
    else
        let (x,xs) = cut s in
            x::list_of_string xs
;;

let rec string_of_list l =
    match l with
       [] -> ""
     | x::xs -> join x (string_of_list xs)
;;


(* matchAtStart *)

(* This function is used to aid the funtcion matchAtStartRE
 in case the RegExp is a Str;
 'a list -> 'a list -> bool * 'a list * 'a list *)
let rec matchAtStartStr line p =
        match p with
            | [] -> (true, line)
            | y::ys -> match line with
                | [] -> (false, [])
                | x::xs -> if x = y then
                        let (x,y) = matchAtStartStr xs ys in(true && x, y)
                    else (false, [])
;;

(* This function is used to aid the funtcion matchAtStartRE
 in case the RegExp is a Class;
 'a list -> 'a list -> bool * 'a list * 'a list *)
let rec matchAtStartClass line p = 
	match line with
	  | [] -> (false, [], [])
	  | x::xs -> match p with
            | [] -> (false, [], [])
            | y::ys -> if x = y then (true, [x], xs)
                else matchAtStartClass line ys
;;

(* This function is used to aid the funtcion matchAtStartRE 
 in case the RegExp is a NClass;
 char list -> regExp -> bool * char list * char list *)
let rec matchAtStartNClass line p =
	match line with
	  | [] -> (false, [], [])
	  | x::xs -> match p with
            | [] -> (true, [],line)
            | y::ys -> if x = y then matchAtStartNClass line ys
                else (true, [x], xs)
;;

(* This function checks if the RegExp re is found in the beginning 
 of the String line , if it is the function returns: true, the respective RegExp and 
 the rest of the String, if it doesn't find it it returns false and
 two empty lists;
 char list -> regExp -> bool * char list * char list *)
let rec matchAtStartRE line re =
        match re with
            | Zero p -> (true, [], line)
            | Str p -> let (x,y) = matchAtStartStr line (list_of_string p) in
                if x = false then (false, [], [])
                else (x,list_of_string p,y)
            | Class p -> matchAtStartClass line (list_of_string p)
            | NClass p -> matchAtStartNClass line (list_of_string p)
            | Any -> (true, line, line)
            | Seq (p,q) -> let (x,y,z) = matchAtStartRE line p in
                let (r,s,t) = matchAtStartRE z q in (x && r, y@s, t) 
            | Or (p,q) -> let (x,y,z) = matchAtStartRE line p in
                let (r,s,t) = matchAtStartRE line q in
                    if (x = true && r = true) then 
                        if List.length y > List.length s then (x,y,z) else (r,s,t)
                    else if x = true then (x,y,z)
                    else if r = true then (r,s,t)
                    else (false, [], [])
            | Not p -> let (x,y,z) = matchAtStartRE line p in
                if x = true then (false, [], [])
                else (true, [], line) 
            | ZeroOrOne p -> let (x,y,z) = matchAtStartRE line p in
                if x = false then (true, [], line)
                else (x,y,z)
            | ZeroOrMore p -> let (x,y,z) = matchAtStartRE line p in
                if x = false then (true, [], line)
                else let (r,s,t) = matchAtStartRE z (ZeroOrMore p) in	
                    if r = true then (true || r, y@s, t)
                    else (true || r, y@s, z)
            | OneOrMore p -> let (x,y,z) = matchAtStartRE line p in
                if x = false then (false, [], [])
                else let (r,s,t) = matchAtStartRE z (OneOrMore p) in	
                    if r = true then (true || r, y@s, t) 
                    else (true || r, y@s, z) 
            | Repeat (m,n,p) ->  matchAtStartRepeat line n p

(* This function is used to aid the funtcion matchAtStartRE 
 in case the RegExp is a Repeat;
 char list -> int -> regExp -> bool * char list * char list *)				
and matchAtStartRepeat line n p =
        if n < 0 then
            (false, [], [])
        else let (x,y,z) = matchAtStartRE line p in	
            if x = false then (false, [], [])
            else let (r,s,t) = matchAtStartRepeat z (n - 1) p in
                if r = false then (x,y,z)
                else (x, y@s, t)
					

let matchAtStart line re =
        let (b,m,r) = matchAtStartRE (list_of_string line) re in
            (b, string_of_list m, string_of_list r)
;;


(* firstMatch *)

(* This function checks if the RegExp re is found in the String line, 
 if it is the function  returns: true, the String behind re, the respective RegExp and 
 the rest of the String, if it doesn't find it it returns false and 
 three empty lists;
 string -> regExp -> bool * string * string * string *)
let rec firstMatchRE line re =
        match line with
            |[] -> (false, [], [], [])
            |x::xs -> match re with 
                (* This set of RegExp's correspond to special cases that
                 could'nt be solved with the default solution*)
                | ZeroOrOne p -> let (r,s,t,u) = firstMatchRE line p in
									if r = false then (false, [], [], line)
									else (r,s,t,u)
                | ZeroOrMore p -> let (r,s,t) = matchAtStartRE line (OneOrMore p) in 
									if r = true then (r, [], s, t)
									else let (a,b,c,d) = firstMatchRE xs re in
											if a = false then (true, [], c, d)
											else (a, x::b, c, d)
                | Not p -> let (r,s,t,u) = firstMatchRE line p in
								if r = true then (false, [], [], [])
								else (true, line, [], [])
                (* The default solution*)
                | _ ->let (r,s,t) = matchAtStartRE line re in 
						if r = true then (r, [], s, t)
						else let (a,b,c,d) = firstMatchRE xs re in
							if a = false then (a, [], c, d)
							else (a, x::b, c, d)
;;

let firstMatch line re =
        let (b,p,m,r) = firstMatchRE (list_of_string line) re in
            (b, string_of_list p, string_of_list m, string_of_list r)
;;


(* allMatches *)

(* This function is used to aid the funtcion allMatches, 
  putting "the previous string", before the match, right;
 'a list * 'a list -> ('a list * 'a list * 'b) list -> ('a list * 'a list * 'b) list *)
let rec allMatchesUpt (x,y) l =
        match l with
            | [] -> []
            | (r,s,t)::xs -> let pre = x@y@r in
                (pre,s,t)::allMatchesUpt (pre,s) xs
;;

(* This function checks if the RegExp re is found in the String line, if it is
 the function returns a list containing all the matches found in the String line,
 if it doesn't find it it returns an empty list;
 char list -> regExp -> (char list * char list * char list) list *)
let rec allMatchesRE line re =
        let (x,y,z,w) = firstMatchRE line re in
            if x = false then [] 
            else (y,z,w)::allMatchesRE w re
;;

let allMatches line re =
        List.map
            (fun (p,m,r) -> (string_of_list p, string_of_list m, string_of_list r))
            (allMatchesUpt ([],[]) (allMatchesRE (list_of_string line) re))
;;


(* replaceAllMatches *)

(* This function checks if the RegExp re is found in the String line, if it 
 is the function returns a String with the replaced parts,if it doesn't find 
 it it returns the string line;
 char list -> char list -> regExp -> char list *)
let rec replaceAllMatchesRE line rpl re =
        let (r,s,t,u) = firstMatchRE line re in
            if r = false then line
            else s@rpl@replaceAllMatchesRE u rpl re
;;

let replaceAllMatches line rpl re =
        let lineStr = list_of_string line in
            let rplStr = list_of_string rpl in
                let res = replaceAllMatchesRE lineStr rplStr re in
                    string_of_list res
;;


(* allMatchesFile *)

(* This function goes through the file and for every line, uses the function allMatches,
 to get all matches of the current string, and after going through the file, 
 puts all the matches found in a list, and if a file's line is empty, it returns an empty list;
 'a list * 'a list -> ('a list * 'a list * 'b) list -> ('a list * 'a list * 'b) list *)
let rec readIn input re =
    try 
        let line = input_line input in
            match (list_of_string line) with
             | [] -> [[]]@readIn input re
             | _ -> [allMatches line re]@readIn input re
	with End_of_file -> []
;;

(* This function checks if the RegExp re is found in the file ni,
 if it is the function returns a list containing all the matches
 found in the String line, if it doesn't find it it returns an empty list;
 string -> regExp -> (string * string * string) list list *)
let allMatchesFile ni re =
        let input = open_in ni in
            let result = readIn input re in
                close_in input ; result
;;


(* allMatchesOverlap *)


(* This function is used to aid the funtcion allMatchesOverlap, 
  putting "the previous string", before the match, right;
 'a list * 'a list -> ('a list * 'a list * 'b) list -> ('a list * 'a list * 'b) list*)
let rec allMatchesOLUpt (x,y) l =
        match l with
            | [] -> []
            | (r,s,t)::xs -> let pre = x@y@r in
                match s with
                    | [] -> []
                    | y::ys -> (pre,s,t)::allMatchesOLUpt (pre,[y]) xs
;;

(* This function checks if the RegExp re is found in the String line, if it is
 the function returns a list containing all the matches found in the String line,
 if it doesn't find it it returns an empty list, this function also allows RegExp's
 to overlap;
 char list -> regExp -> (char list * char list * char list) list *)
let rec allMatchesOverlapRE line re =
        let (x,y,z,w) = firstMatchRE line re in
            if x = false then [] 
            else match z with
                | [] -> []
                | a::ab -> (y,z,w)::allMatchesOverlapRE (ab@w) re
;;

let allMatchesOverlap line re =
        List.map
            (fun (p,m,r) -> (string_of_list p, string_of_list m, string_of_list r))
            (allMatchesOLUpt ([],[]) (allMatchesOverlapRE (list_of_string line) re))
;;


(* matchAtStartGreedyRE *)

let matchAtStartGreedyRE line re =
        (false, [], [])
;;

let matchAtStartGreedy line re =
        let (b,m,r) = matchAtStartGreedyRE (list_of_string line) re in
            (b, string_of_list m, string_of_list r)
;;
