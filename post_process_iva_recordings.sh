#!/bin/bash

function ffmpg(){
    vid="$1"
    mp="$2"
    aud="$3" 
    if [[ "$aud" ]];then
        echo ffmpeg -y -fflags +genpts  -i "${vid}" -i "${aud}"  "$mp" >> $cmd
        ffmpeg -y -fflags +genpts  -i "${vid}" -i "${aud}"  "$mp" 
    else
        echo ffmpeg -y -fflags +genpts  -i "${vid}"  "$mp" >> $cmd
        ffmpeg -y -fflags +genpts  -i "${vid}"  "$mp" 
    fi 
}  
 
function av(){
    vid="$1"
    mp="$2"  
    sil="$3" 
    echo avconv -y -i "${vid}" "$mp" >> $cmd 
    avconv -y -i "${vid}" "$mp" 
}

function av_vid(){
    v="$1"
    m="$2"  
    echo avconv -y -i "${v}" "${m}" >> $cmd 
    avconv -y -i "${v}" "${m}" 
} 
  
function convert_continious_recordings(){
	max=1
	audio=
	if [[ -d "$1" && "$2" && -f "${3}.webm" ]];then
	    max="$2"
	    u_id=`get_id $1`
	    
	    dash=`echo "${3}" | awk '{l=length($0);if(substr($0,l-1,1)== "-") print "-"}'`
	    vid_name=`echo "${3}" | awk '{l=length($0);if(substr($0,l-1,1)== "-") print substr($0,1,l-2);else print substr($0,1,l-1);}'`
	    
	    cmd="${vid_name}.cmd"
	    > "${cmd}"
	    
	    video="${vid_name}.webm"
	    mp4="${vid_name}.mp4" 
	    mp4_list="${vid_name}.txt"
	    aud_sil_dur=2
	    [[ "$1" != "." ]] && cd "$1"
	    
	    if [[ -f "${4}.webm" ]];then
	        aud_name=`echo "${4}" | awk '{l=length($0);if(substr($0,l-1,1)== "-") print substr($0,1,l-2);else print substr($0,1,l-1);}'`
	        audio="${aud_name}.webm" 
	        mp3="${aud_name}.mp3" 
	    fi
	    
	    [[ "${5}" ]] && aud_sil_dur="${5}"
	    
	    #more than one video/audio
	    if [[ "$max" -ge 2 ]];then
	        > "${mp4_list}" 
	        for i in `seq ${max}`;do 
	            [[ -f "${vid_name}${dash}${i}.webm" ]] && echo "file '${vid_name}${dash}${i}.mp4'"
	            done > "${mp4_list}"  
	                
	        if [[ "$audio" ]];then
	            #video/audio
	            mp3_list="${aud_name}.txt"
	            > "${mp3_list}" 
	            for i in `seq ${max}`;do 
	                [[ -f "${aud_name}${dash}${i}.webm" ]] && echo "file '${aud_name}${dash}${i}.mp3'"
	                done > "${mp3_list}" 
	            c=0 
	            for i in `seq ${max}`;do  
	                [[ -f "${vid_name}${dash}${i}.webm" && -f "${aud_name}${dash}${i}.webm" ]] && av_vid "${vid_name}${dash}${i}.webm" "${vid_name}${dash}${i}-tmp.mp4" && av "${aud_name}${dash}${i}.webm" "${aud_name}${dash}${i}.mp3" && ffmpg "${vid_name}${dash}${i}-tmp.mp4" "${vid_name}${dash}${i}.mp4" "${aud_name}${dash}${i}.mp3" && rm -fr "${vid_name}${dash}${i}-tmp.mp4" && (( c++ )) 
	            done  
	            
	            #combine mp3s 
	            concat_audio_videos $1 "mp3" "audio-recording" $u_id && rm -f "audio-recording.txt"
	            concat_audio_videos $1 "mp4" "video-recording" $u_id && rm -f "video-recording.txt"
	        else
	            #video only
	            c=0 
	            for i in `seq ${max}`;do 
	                [[ -f "${vid_name}${dash}${i}.webm" ]] && ffmpg "${vid_name}${dash}${i}.webm" "${vid_name}${dash}${i}.mp4" && (( c++ ))
	            done   
	            
	            #combine mp4s
	            concat_audio_videos $1 "mp4" "video-recording" $u_id
	        fi  
	    else
	        #one video/audio 
	        if [[ "$audio" ]];then
	            #video/audio
	            ffmpg "${video}" "${mp4}" "${audio}" 
	        else
	            #video only
	            ffmpg "${video}" "${mp4}" 
	        fi 
	    fi 
	    
	    # extract the mp3 from mp4
	    if [[ "$audio" == "" ]];then
	        ffmpg "$mp4" "$mp3"  
	    fi
	    
	    # list of the commands
	    cat "${cmd}"
	    rm -f "${cmd}"
	else
	    echo "converts webm files to mp4/mp3 files ..."
	    echo "usgae $0 <video_folder> <max_no_of_files> <video_file> [<audio_file> <init_sil_dur>]"
	    echo "e.g. $0 . 1 video-recording-10 audio-recording-10"
	    echo "e.g. $0 . 180 video-recording-1 audio-recording-1 0"
	    echo "e.g. $0 . 180 video-recording-1"
	fi
} 

# score ['Not at all','Several days', 'More than half the days', 'Nearly every day']
survey_options='Not at all\nSeveral days\nMore than half the days\nNearly every day'
score_survey(){
	awk 'NR==FNR{j++;a["\""toupper($0)"\""]=j-1;next}{split($0,b,",");u=toupper(b[1]);s+=a[u]}END{print s}' <(echo -e $survey_options) "$1"
}

function empty_file(){
	rm -f $1
	[[ "$2" == "" ]] && touch $1
}

# put together all the audio/vodeo in Q1-R0.mp3/mp4 format 
concat_q_rs() {
	d="$1"
	u_id=`get_id ${d}`
	ext="mp4" && [[ "$2" == "mp3" ]] && ext="mp3"
	echo "concat_q_rs .. $d $u_id $ext"

	if [[ "$ext" == "mp3" ]];then 
		out_file="${d}/${u_id}_audio_recording.${ext}"
		segment="${d}/segment.tmp"
		empty_file $segment
	else
		segment=""
		out_file="${d}/${u_id}_video_recording.${ext}"
	fi

	text_file="${d}/text_${ext}.txt" 
	empty_file $text_file ""
	empty_file $out_file "No"

	for q in {1..15};do
		for r in {0..5};do
			f="${d}/Q${q}-R${r}.${ext}"
			f="Q${q}-R${r}.${ext}"
			if [[ -f "${d}/$f" ]];then 
				echo "file '$f'" >> $text_file 
				[[ "$ext" == "mp3" ]] && duration=`get_duration $d/$f` && echo "${q},${r},${duration}" >> $segment 
			fi
		done
	done  
	cd $d 
	ffmpeg -f concat -i $text_file -codec copy $out_file  

	[[ "$ext" == "mp3" ]] && awk -v d="0" '{split($1,a,",");print a[1]","a[2]","d;d+=a[3]}END{print 1+a[1]","a[2]","d;}' $segment > ${d}/segment.txt
	#rm -f $text_file $segment 
} 

concat_audio_videos() {
	d="$1"
	ext="mp3"
	name="audio-recording"
	u_id="$4"   
	[[ "$3" == "video-recording" ]] && name="$3" 
	text_file="${d}/text_${name}_${ext}.txt"
	if [[ "$2" == "mp4" ]];then
		ext="$2" 
		out_file="${d}/${u_id}_video_recording.${ext}" 
	else
		out_file="${d}/${u_id}_audio_recording.${ext}" 
	fi 

	empty_file $text_file
	empty_file $out_file "No"

	cd $d 
	mpgs=""
	for r in {1..200};do  
		f="${name}-${r}.${ext}"
		if [[ -f "${d}/$f" ]];then
			if [[ $ext == "mp4" ]];then
				ffmpeg -i $f -qscale 0 ${r}.mpg  
				mpgs="${mpgs} ${r}.mpg"
			else
				echo "file '$f'" >> $text_file
			fi 
		fi 
	done 
	if [[ $ext == "mp4" ]];then
		echo "cat ${mpgs} | ffmpeg -f mpeg -i - -qscale 0 -vcodec mpeg4 $out_file"
		cat ${mpgs} | ffmpeg -f mpeg -i - -qscale 0 -vcodec mpeg4 $out_file && rm -f ${mpgs} ${name}-*.${ext}
	else
		ffmpeg -f concat -i $text_file $out_file && rm -f ${name}-*.${ext}
	fi
	rm -f $text_file

	echo "output file:$out_file" 
} 

function get_duration(){ 
	ffmpeg -i $1 2>&1 | grep Duration | awk '{gsub(",","",$2);split($2,a,":");print 3600*a[1]+60*a[2]+a[3]}' 
}

function get_id(){
	#e.g. 266-H003-2020-11-27-10-24-16-6ce0d951-16df-46e0-b4fc-f5931388a71c --> 266-H003-2020-11-27-10-24-16
	echo $1 | awk '{m=split($0,b,"/");k=split(b[m],a,"-");o=a[1];for(j=2;j<=k-5;j++) o=o"-"a[j];print o}'
}

report=""
function main_process(){   
	seperated_questions_found=0
	if [[ -f $1/survey3.csv ]];then
		s3=`score_survey $1/survey3.csv` 
		s3_c=`awk '{j++}END{print j-1}' $1/survey3.csv`

		touch "$1/phq_9_score_${s3}_${s3_c}" 
		ls -l "$1/phq_9_score_${s3}_${s3_c}"
	fi 

	if [[ -f $1/survey4.csv ]];then 
		s4=`score_survey $1/survey4.csv`
		s4_c=`awk '{j++}END{print j-1}' $1/survey4.csv`

		touch "$1/gad_7_score_${s4}_${s4_c}" 
		ls -l "$1/gad_7_score_${s4}_${s4_c}"
	fi 

	[[ $2 == "1" ]] && return  

	if [[ -f $1/Q1-R0.mp3 ]];then 
		concat_q_rs $1 mp3
		seperated_questions_found=1
	fi

	if [[ -f $1/Q1-R0.mp4 ]];then
		concat_q_rs $1 mp4
		seperated_questions_found=1
	fi  
	
	if [[ "$seperated_questions_found" == "0" ]];then
		if [[ -f $1/video-recording-1.webm && -f $1/audio-recording-1.webm ]];then  
			convert_continious_recordings $1 180 $1/video-recording-1 $1/audio-recording-1 0 
		else
			report="$report - Cannot convert $1 files to audio/videos!"
			echo "Error: Cannot convert $1 files to audio/videos ...!" 
			#cd $1
			#ffmpeg -i audio-recording.webm audio-recording.mp3
			#ffmpeg -i video-recording.webm video-recording.mp4
			#avconv -y -i video-recording.webm -codec mpeg4 video-recording.mp4
			#ffmpeg -i video-recording.webm  -c:v copy -strict experimental video-recording.mp4 
			#cat 1.mpg | ffmpeg -f mpeg -i - -qscale 0 -vcodec mpeg4 video-recording.mp4 && rm -f 1.mpg
		fi 
	fi
	echo "$1 processed"  
} 

function surveys(){
	p=$2/survey_scores.csv
	empty_file $p
	echo "row,record-id,phq9/gad7,score,total_score" >> $p
	for x in $1/*-*-*/*{phq_9_score_,gad_7_score_}*; do echo $x;done | awk -v r="3" '{k=split($0,a,"/");m=split(a[k-1],b,"-");o=b[1];for(j=2;j<=m-5;j++) o=o"-"b[j];p="phq_9";n=split(a[k],q,"_");if(a[k] ~ "gad_7") p="gad_7";l++;print l","o","p","q[n-1]","q[n]*r}' >> $p
	echo "cat $p ..."
	cat $p 
}

function segments(){
	p=$2/all_segments
	empty_file $p
	for x in $1/*/segment.txt; do fld=`echo $x|awk '{k=split($0,a,"/");print a[k-1]}'`;id=`get_id $fld`;awk -v id="$id" '{print id","$0}' $x;done >> $p
	echo "cat $p ..."
	cat $p 
}
 
if [[ -d $1 ]];then  
	if [[ $2 == "-R" || $2 == "-RS" ]];then  
		summary=$1/summary 
		rm -r $summary/*.csv $summary/*.txt $summary/all_segments
		skipconv="" && [[ $2 == "-RS" ]] && skipconv="1"

		for d in $1/*;do
			[[ -d $d ]] && main_process $d $skipconv
		done  
		
		mkdir $summary 
		
		cp $1/*/*_audio_recording.mp3 $summary
		cp $1/*/*_video_recording.mp4 $summary 
		surveys $1 $summary 

		segments $1 $summary
		s=$summary/summary.txt
		empty_file $s
		phq9=`awk '{j++;if(j>1 && $1 ~ "phq") g++}END{print g}' $summary/survey_scores.csv`
		gad7=`awk '{j++;if(j>1 && $1 ~ "gad") g++}END{print g}' $summary/survey_scores.csv`
		
		mp3=`ls $summary/*.mp3|awk '{j++;}END{print j}'`
		mp4=`ls $summary/*.mp4|awk '{j++;}END{print j}'`

		echo "No of phq9 completed:$phq9" >> $s
		echo "No of gad7 completed:$gad7" >> $s
		echo "No of mp3 recordings:$mp3" >> $s
		echo "No of mp4 recordings:$mp4" >> $s

		cat $s
	else
		main_process $1
	fi

	[[ "$report" != "" ]] && echo "$report" 
else
	echo "post process the iva recordings, e.g.concat multiple mp3/mp4 files ..."
	echo "usage $0 <dir> audio/video conversion"
	echo "usage $0 <dir> -R recursively for all subdirs"
	echo "usage $0 <dir> -RS recursively for all subdirs without audio/video conversion" 
fi