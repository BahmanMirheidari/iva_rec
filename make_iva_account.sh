#/bin/sh                                                                                                                                                                                                                 
n=50
p_start=261
u_start=284
r_start=21
r_prefix="S"
repeat=":ivastroke1|.R1:ivastroke2|.R2:ivastroke1|.R3:ivastroke2"
r_len=4
len=12

function pass(){
        l1="$1"
        n1="$2"
        for k in $(seq "${n1}");do
                openssl rand -base64 "32"|awk -v l="${l1}" '{gsub("=|/|\\+","",$0);print substr($0,1,l)}'
        done
}

if [[ "$#" -ge 7 ]];then
        n="${1}"
        p_start="${2}"
        u_start="${3}"
        r_start="${4}"
        r_prefix="${5}"
        repeat="${6}"
        r_len="${7}"

        [[ ${8} ]] && len="${8}"
        (( p_start-- ))

        for i in $(seq $n);do
            pass "${len}" "${r_len}" |awk -v s="${i}" -v p="${p_start}" -v u="${u_start}" -v r="${r_start}" -v x="${r_prefix}" -v e="${repeat}" '{j++;n=split(e,a,"|");for(i=1;i<=n;i++){split(a[i],b,":");if(i==j) printf("%s,%s,%s-"x"%03d,"x"%03d,%s\n","participant"s+p+i,$1,u+s""b[1],s+r,s+r,b[2])}}'
            (( p_start+=r_len-1 ))
        done

else
        echo "builds a list of new accounts for the IVA website ..."
        echo "usage $0 <n:50> <p_start:260> <u_start:283> <r_start:20> <r_prefix:S> <repeat:ivastroke1|.R1:ivastroke2|.R2:ivastroke1|.R3:ivastroke2> <r_len:4> <len:12>"
        echo "e.g. $0 50 264 284 2 S \":ivastroke1|.R1:ivastroke2|.R2:ivastroke1|.R3:ivastroke2\" 4 12"
        echo "e.g. $0 66 464 334 6 H \":ivastroke1|.R1:ivastroke2|.R2:ivastroke1|.R3:ivastroke2\" 4 12"
fi

