#!/bin/bash
function ffmpg(){
    vid="$1"
    mp="$2"
    aud="$3" 
    if [[ "$aud" ]];then
        echo ffmpeg -y -fflags +genpts  -i "${vid}" -i "${aud}" -c:v copy "$mp" >> $cmd
        ffmpeg -y -fflags +genpts  -i "${vid}" -i "${aud}" -c:v copy "$mp" 
    else
        echo ffmpeg -y -fflags +genpts  -i "${vid}" -c:v copy "$mp" >> $cmd
        ffmpeg -y -fflags +genpts  -i "${vid}" -c:v copy "$mp" 
    fi 
}

function ffmpg_concat(){
    list="$1"
    out="$2" 
     
    echo ffmpeg -y -f concat -i "${list}" -c copy "${out}" >> $cmd
    ffmpeg -y -f concat -i "${list}" -c copy "${out}" 
}

function ffmpg_concat_vid(){
    list="$1"
    out="$2" 
     
    echo ffmpeg -y -f concat -i "${list}" -c:v copy "${out}" >> $cmd
    ffmpeg -y -f concat -i "${list}" -c:v copy "${out}" 
}

function ffmpeg_c2(){
    i1="$1"
    i2="$2" 
    o="$3" 
    echo ffmpeg -y -i "${i1}" -i "${i2}" -filter_complex  "[0:v][0:a][1:v][1:a] concat=n=2:v=1:a=1 [outv] [outa]"  -map "[outv]" -map "[outa]" ${o} >> $cmd
    ffmpeg -y -i "${i1}" -i "${i2}" -filter_complex  "[0:v][0:a][1:v][1:a] concat=n=2:v=1:a=1 [outv] [outa]"  -map "[outv]" -map "[outa]" ${o}
}

function concat_mp4(){
    c="$1"
    vid_name="$2"
    dash="$3"
    aud_name="$4"
    sil="$5"
    
    for i in `seq ${c}`;do  
        if (( i == 1 ));then
            cp "${vid_name}${dash}${i}.mp4" "tmp-${vid_name}.mp4"
        fi
        (( j=i+1 ))
        if (( j <= c ));then 
            ffmpeg_c2 "tmp-${vid_name}.mp4" "${vid_name}${dash}${j}.mp4" "${vid_name}.mp4"
            cp "${vid_name}.mp4" "tmp-${vid_name}.mp4" 
        fi
    done 
    
    if (( sil != 0));then
        if (( sil > 0 ));then
            ffmpeg -y -ss "$sil" -i "${aud_name}.mp3" "aud-${aud_name}.mp3"  
            d=`ffprobe "aud-${aud_name}.mp3" -show_format 2>&1 | sed -n 's/duration=//p'`

            echo avconv -y -i "${vid_name}.mp4" -vcodec copy -an "vid-${vid_name}.mp4" >> $cmd
            avconv -y -i "${vid_name}.mp4" -vcodec copy -an "vid-${vid_name}.mp4"  

            d2=`ffprobe "${vid_name}.mp4" -show_format 2>&1 | sed -n 's/duration=//p'`

            diff=`echo ${d2} |awk  -v d="$d" '{print $1-d}'` 

            echo ffmpeg -y -i "aud-${aud_name}.mp3" -ss "${diff}" -t "$d" -i "vid-${vid_name}.mp4" "${vid_name}.mp4" >> $cmd
            ffmpeg -y -i "aud-${aud_name}.mp3" -ss "${diff}" -t "$d" -i "vid-${vid_name}.mp4" "${vid_name}.mp4" 
        else  
            sil="$(( -sil ))"
            echo avconv -y -ss "$sil" -i "${vid_name}.mp4" -vcodec copy -an "vid-${vid_name}.mp4" >> $cmd
            avconv -y -ss "$sil" -i "${vid_name}.mp4" -vcodec copy -an "vid-${vid_name}.mp4"   
            
            d=`ffprobe "vid-${vid_name}.mp4" -show_format 2>&1 | sed -n 's/duration=//p'` 

            d2=`ffprobe "${aud_name}.mp3" -show_format 2>&1 | sed -n 's/duration=//p'`

            diff=`echo ${d2} |awk  -v d="$d" '{print $1-d}'` 

            echo ffmpeg -y -ss "${diff}" -t "$d" -i "aud-${aud_name}.mp3" -i "vid-${vid_name}.mp4" "${vid_name}.mp4" >> $cmd
            ffmpeg -y -ss "${diff}" -t "$d" -i "aud-${aud_name}.mp3" -i "vid-${vid_name}.mp4" "${vid_name}.mp4" 
        fi
        
        rm -rf "tmp-${vid_name}.mp4" "vid-${vid_name}.mp4" "aud-${aud_name}.mp3"
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
  
max=1
audio=
if [[ -d "$1" && "$2" && -f "${3}.webm" ]];then
    max="$2"
    # check the name contains - NO or NO at the end
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
                [[ -f "${vid_name}${dash}${i}.webm" && -f "${aud_name}${dash}${i}.webm" ]] && av_vid "${vid_name}${dash}${i}.webm" "tmp-${vid_name}${dash}${i}.mp4" && av "${aud_name}${dash}${i}.webm" "${aud_name}${dash}${i}.mp3" && ffmpg "tmp-${vid_name}${dash}${i}.mp4" "${vid_name}${dash}${i}.mp4" "${aud_name}${dash}${i}.mp3" && rm -fr "tmp-${vid_name}${dash}${i}.mp4" && (( c++ )) 
            done  
            
            #combine mp3s 
            ffmpg_concat "${mp3_list}" "${mp3}" 
            
            #combine mp4s
            concat_mp4 "${c}" "${vid_name}" "${dash}" "${aud_name}" "${aud_sil_dur}"
            for i in `seq ${c}`;do
                rm -f "${aud_name}${dash}${i}.mp3" "${vid_name}${dash}${i}.mp4" 
            done
            rm -f "${mp3_list}" "${mp4_list}" 
        else
            #video only
            c=0 
            for i in `seq ${max}`;do 
                [[ -f "${vid_name}${dash}${i}.webm" ]] && ffmpg "${vid_name}${dash}${i}.webm" "${vid_name}${dash}${i}.mp4" && (( c++ ))
            done   
            
            #combine mp4s
            ffmpg_concat "${mp4_list}" "${mp4}"
            
            for i in `seq ${c}`;do
                rm -f "${vid_name}${dash}${i}.mp4"
            done 
            
            rm -f "${mp4_list}"
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